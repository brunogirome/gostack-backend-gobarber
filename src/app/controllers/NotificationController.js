import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!isProvider) {
      // Lembrando que 401 é bad request!
      return res.status(401).json({ error: 'User is not a provider' });
    }

    // Quando se passa, por exemplo, uma ordenação no mongoose, os métodos são
    // filtrados por cascata, já que no find() é retornado um array, daí desse
    // array é aplicado um sort, então acontece [].sort(), e assim
    // sucessivamente...
    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }
}

export default new NotificationController();
