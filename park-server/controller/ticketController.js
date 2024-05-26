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
  
      console.log('Запрос на покупку билета:', { name_attraction, email, role }); // Логирование запроса
  
      const user = await User.findOne({ where: { email } });
      const attraction = await Attraction.findOne({ where: { name: name_attraction } });
  
      console.log('Найденный пользователь:', user); // Логирование найденного пользователя
      console.log('Найденный аттракцион:', attraction); // Логирование найденного аттракциона
  
      // Проверяем, есть ли уже купленный билет на этот аттракцион
      const existingTicket = await Ticket.findOne({
        where: { name: attraction.name, username: user.email, status: 'ACTIVE' }
      });
      if (existingTicket) {
        console.log('У пользователя уже есть билет на этот аттракцион:', existingTicket); // Логирование существующего билета
        return res.json("У вас уже есть такой билет");
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
      next(ApiError.badRequest(e.message));
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
      return next(ApiError.badRequest('Билет не найден или уже использован'));
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
          ApiError.badRequest('Сейчас атракцион закрыт. Пожалуйста, выберите другое время.')
      );
  }

  await Attendance.create({
      userId: user.email,
      ticketId: ticket.ticket_id,
      visit_time: new Date()
  });

  await ticket.update({ status: 'USED', used_at: new Date() });
  res.json({ message: 'Билет успешно использован' });
}
  
async getUserTicket(req, res, next) {
  try {
    const { email } = req.user;

    // Find tickets belonging to the user
    const tickets = await Ticket.findAll({
      where: { username: email }, // Use 'username' field for matching
    });

    res.json(tickets); // Send the list of tickets as a response
  } catch (e) {
    console.error('Ошибка при получении билетов:', e); 
    next(ApiError.badRequest(e.message)); // Use ApiError for consistent error handling
  }
}}


module.exports = new ticketController()