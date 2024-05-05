const ApiError = require('../error/Apierror')
const { User, Attraction, Ticket, Attendance } = require('../models/models')
const authMiddleware = require('../middleware/authMiddleware')
const jwt = require('jsonwebtoken')
const config = require('../config')



class ticketController {

  async buyTicket(req, res, next) {//покупка билетов
    try {
      const { name_attraction } = req.body;
      const { email, role } = req.user;
      const user = await User.findOne({ where: { email } })
      const attraction = await Attraction.findOne({ where: { name: name_attraction } })

      // Проверяем, есть ли уже купленный билет на этот аттракцион
      const existingTicket = await Ticket.findOne({
        where: { name: attraction.name, username: user.email, status: 'ACTIVE' }
      });
      if (existingTicket) {
        return res.json("У вас уже есть такой билет")
      }

      if (!attraction) {
        return next(ApiError.badRequest('Атракцион не найден'));
      }
      if (user.balance < attraction.price) {
        return next(ApiError.badRequest('Недостаточно средств на балансе'));
      }
      await user.update({ balance: user.balance - attraction.price });
      const ticket = await Ticket.create({
        name: attraction.name,
        username: user.email,
        userId: user.id,
        attractionId: attraction.id
      })
      res.json(ticket);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }


  async buyTicket(req, res, next) { //покупка билетов
    try {
        const { name_attraction } = req.body;
        const { email, role } = req.user;
        const user = await User.findOne({ where: { email } });
        const attraction = await Attraction.findOne({ where: { name: name_attraction } });

        // Проверяем, есть ли уже купленный билет на этот аттракцион
        const existingTicket = await Ticket.findOne({
            where: { name: attraction.name, username: user.email, status: 'ACTIVE' }
        });
        if (existingTicket) {
            return res.json("У вас уже есть такой билет");
        }

        if (!attraction) {
            return next(ApiError.badRequest('Атракцион не найден'));
        }
        if (user.balance < attraction.price) {
            return next(ApiError.badRequest('Недостаточно средств на балансе'));
        }
        await user.update({ balance: user.balance - attraction.price });
        const ticket = await Ticket.create({
            name: attraction.name,
            username: user.email,
            userId: user.email,
            attractionId: attraction.id
        });
        res.json(ticket);
    } catch (e) {
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
}}

module.exports = new ticketController()