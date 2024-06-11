const ApiError = require('../error/Apierror')
const { User, Attraction, Ticket, Attendance } = require('../models/models')
const authMiddleware = require('../middleware/authMiddleware')
const jwt = require('jsonwebtoken')
const config = require('../config')



class ticketController {

  
  async buyTicket(req, res, next) { //покупка билетов
    try {
      const { name_attraction } = req.body;
      const { email, role } = req.user;
  
      console.log('Запрос на покупку билета:', { name_attraction, email, role }); 
  
      const user = await User.findOne({ where: { email } });
      const attraction = await Attraction.findOne({ where: { name: name_attraction } });

      // Проверяем, есть ли уже купленный билет на этот аттракцион
      const existingTicket = await Ticket.findOne({
        where: { name: attraction.name, username: user.email, status: 'ACTIVE' }
      });
      if (existingTicket) {
        console.log('У пользователя уже есть билет на этот аттракцион:', existingTicket); // Логирование существующего билета
        return next(ApiError.badRequest("У вас уже есть такой билет"));
      }
  
      if (!attraction) {
        console.error('Атракцион не найден:', name_attraction); // Логирование ошибки
        return next(ApiError.badRequest('Атракцион не найден'));
      }
      if (user.balance < attraction.price) {
        console.error('Недостаточно средств на балансе:', user.balance, attraction.price); // Логирование ошибки
        return next(ApiError.badRequest('Недостаточно средств на балансе'));
      }
  
      console.log('Обновление баланса пользователя:', user.balance, attraction.price); // Логирование обновления баланса
  
      await user.update({ balance: user.balance - attraction.price });
  
      const ticket = await Ticket.create({
        name: attraction.name,
        username: user.email,
        userId: user.id,
        attractionId: attraction.id
      });
  
      console.log('Созданный билет:', ticket); // Логирование созданного билета
  
      res.json(ticket);
    } catch (e) {
      console.error('Ошибка при покупке билета:', e); // Логирование ошибки
      next(ApiError.internal(e.message));
    }
  }
  


async useTicket(req, res, next) {
  const { name } = req.body;
  const { email } = req.user;

  const user = await User.findOne({ where: { email } });
  const attraction = await Attraction.findOne({ where: {name} });

  if (!attraction) {
      return next(ApiError.badRequest('Аттракцион не найден'));
  }
  const ticket = await Ticket.findOne({
      where: {
          name: name,
          username: user.email,
          status: 'ACTIVE'
      },
      include: { model: Attraction }
  });

  if (!ticket) {
      return next(ApiError.badRequest('Билет  уже использован'));
  }

  if (!attraction.working_hours) {
      return next(ApiError.badRequest('Расписание работы аттракциона не определено'));
  }

  const [startHours, startMinutes, endHours, endMinutes] = attraction.working_hours.split('-')
      .flatMap((time) => time.split('.').map(Number));
  const currentTime = new Date();

  // Проверяем, что текущее время находится в рабочем диапазоне
  if (
      currentTime.getHours() < startHours ||
      (currentTime.getHours() === startHours && currentTime.getMinutes() < startMinutes) ||
      currentTime.getHours() >= endHours ||
      (currentTime.getHours() === endHours && currentTime.getMinutes() >= endMinutes)
  ) {
      return next(
          ApiError.badRequest('Сейчас атракцион закрыт. Приходите другое время.')
      );
  }

  await Attendance.create({
      userId: user.userId,
      ticketId: ticket.ticket_id,
      visit_time: new Date(),
      username: user.email
  });

  await ticket.update({ status: 'USED', used_at: new Date() });
  res.json({ message: 'Билет успешно использован' });
}
  
async getUserTicket(req, res, next) {
  try {
    const { email } = req.user;

    const tickets = await Ticket.findAll({
      where: { username: email },
    });

    res.json(tickets);
  } catch (e) {
    console.error('Ошибка при получении билетов:', e); 
    next(ApiError.badRequest(e.message));
  }
  
}
async cancelTicket(req, res, next) {
  try {
    const { name } = req.body;
    const { email } = req.user;

    const user = await User.findOne({ where: { email } });
    const ticket = await Ticket.findOne({
      where: {
        name: name,
        username: user.email,
        status: 'ACTIVE'
      }
    });

    if (!ticket) {
      return next(ApiError.badRequest('Билет не найден'));
    }

    const purchaseTime = new Date(ticket.createdAt);
    const currentTime = new Date();
    const timeDifference = currentTime - purchaseTime;
    const hoursDifference = timeDifference / (1000 * 60 * 60); // Разница во времени в часах

    // Проверяем, прошло ли 24 часа с момента покупки
    if (hoursDifference > 24) {
      return next(ApiError.badRequest('Отмена билета возможна только за 24 часа до покупки'));
    }

    console.log(ticket.price);
    // Возвращаем деньги на баланс пользователя
    await user.update({ balance: user.balance + ticket.price });
  

    // Меняем статус билета на "отмененный"
    await ticket.update({ status: 'CANCELED' });

    res.json({ message: 'Билет успешно отменен, деньги возвращены на баланс' });
  } catch (e) {
    console.error('Ошибка при отмене билета:', e);
    next(ApiError.internal(e.message));
  }
}
}



module.exports = new ticketController()