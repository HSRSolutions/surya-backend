const Ticket = require('../models/ticket');

exports.createTicket = async (req, res) => {
    try {
        const ticket = new Ticket(req.body);
        const savedTicket = await ticket.save();
        res.status(200).json({
            message: 'Support ticket created successfully',
            ticket: savedTicket
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

exports.getTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json(ticket);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}


exports.updateTicket = async(req, res) =>{

    try {
        const updatedTicket = await Ticket.findByIdAndUpdate(
          req.params.ticketId,
          { stage: req.body.stage },
          { new: true }
        );
        if (!updatedTicket) {
          return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json({
          message: 'Support ticket updated successfully',
          ticket: updatedTicket
        });
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
}


exports.deleteTicket = async(req, res) =>{

    try {
        const deletedTicket = await Ticket.findByIdAndDelete(req.params.ticketId);
        if (!deletedTicket) {
          return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json({ message: 'Support ticket deleted successfully' });
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
}

exports.allTickets = async(req, res)=>{
  try{
    const allTickets = await Ticket.find().sort({ createdAt: -1 });
    res.status(200).json(allTickets);
  }catch(err){
    res.status(400).json({ error: err.message });
  }
}