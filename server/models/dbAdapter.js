const mongoose = require('mongoose');
const memoryStore = require('./inMemoryStore');
const UserModel = require('./User');
const ServiceModel = require('./Service');
const BarberModel = require('./Barber');
const AppointmentModel = require('./Appointment');

const isMongoActive = () => mongoose.connection.readyState === 1;

// ================= USER ADAPTER =================
const User = {
  async findOne(query) {
    if (isMongoActive()) return await UserModel.findOne(query);
    if (query.phone) {
      return memoryStore.users.find((u) => u.phone === query.phone) || null;
    }
    if (query.email) {
      return (
        memoryStore.users.find(
          (u) =>
            u.email?.toLowerCase() === query.email.toLowerCase() &&
            (!query.role || u.role === query.role)
        ) || null
      );
    }
    return null;
  },

  async findById(id) {
    if (isMongoActive()) return await UserModel.findById(id);
    return memoryStore.users.find((u) => String(u._id) === String(id)) || null;
  },

  async create(data) {
    if (isMongoActive()) return await UserModel.create(data);
    const newUser = {
      _id: 'usr_' + Date.now() + Math.random().toString(36).substring(2, 6),
      role: 'customer',
      ...data,
      createdAt: new Date(),
    };
    memoryStore.users.push(newUser);
    return newUser;
  },
};

// ================= SERVICE ADAPTER =================
const Service = {
  async find(query = {}) {
    if (isMongoActive()) {
      const q = ServiceModel.find(query);
      return await q.sort({ category: 1, name: 1 });
    }
    let list = [...memoryStore.services];
    if (query.isActive !== undefined) {
      list = list.filter((s) => s.isActive === query.isActive);
    }
    if (query._id && query._id.$in) {
      const ids = query._id.$in.map(String);
      list = list.filter((s) => ids.includes(String(s._id)));
    }
    return list.sort((a, b) => a.name.localeCompare(b.name));
  },

  async create(data) {
    if (isMongoActive()) return await ServiceModel.create(data);
    const newService = {
      _id: 'srv_' + Date.now(),
      isActive: true,
      ...data,
      createdAt: new Date(),
    };
    memoryStore.services.push(newService);
    return newService;
  },

  async findByIdAndUpdate(id, data, options = {}) {
    if (isMongoActive()) return await ServiceModel.findByIdAndUpdate(id, data, options);
    const idx = memoryStore.services.findIndex((s) => String(s._id) === String(id));
    if (idx === -1) return null;
    memoryStore.services[idx] = { ...memoryStore.services[idx], ...data };
    return memoryStore.services[idx];
  },

  async findByIdAndDelete(id) {
    if (isMongoActive()) return await ServiceModel.findByIdAndDelete(id);
    const idx = memoryStore.services.findIndex((s) => String(s._id) === String(id));
    if (idx === -1) return null;
    const deleted = memoryStore.services.splice(idx, 1)[0];
    return deleted;
  },

  async countDocuments(query = {}) {
    if (isMongoActive()) return await ServiceModel.countDocuments(query);
    if (query.isActive !== undefined) {
      return memoryStore.services.filter((s) => s.isActive === query.isActive).length;
    }
    return memoryStore.services.length;
  },
};

// ================= BARBER ADAPTER =================
const Barber = {
  async find(query = {}) {
    if (isMongoActive()) {
      return await BarberModel.find(query).sort({ name: 1 });
    }
    let list = [...memoryStore.barbers];
    if (query.isActive !== undefined) {
      list = list.filter((b) => b.isActive === query.isActive);
    }
    return list.sort((a, b) => a.name.localeCompare(b.name));
  },

  async findById(id) {
    if (isMongoActive()) return await BarberModel.findById(id);
    return memoryStore.barbers.find((b) => String(b._id) === String(id)) || null;
  },

  async findOne(query = {}) {
    if (isMongoActive()) return await BarberModel.findOne(query);
    if (query.isActive !== undefined) {
      return memoryStore.barbers.find((b) => b.isActive === query.isActive) || null;
    }
    return memoryStore.barbers[0] || null;
  },

  async create(data) {
    if (isMongoActive()) return await BarberModel.create(data);
    const newBarber = {
      _id: 'barb_' + Date.now(),
      rating: 4.9,
      isActive: true,
      ...data,
      createdAt: new Date(),
    };
    memoryStore.barbers.push(newBarber);
    return newBarber;
  },

  async findByIdAndUpdate(id, data, options = {}) {
    if (isMongoActive()) return await BarberModel.findByIdAndUpdate(id, data, options);
    const idx = memoryStore.barbers.findIndex((b) => String(b._id) === String(id));
    if (idx === -1) return null;
    memoryStore.barbers[idx] = { ...memoryStore.barbers[idx], ...data };
    return memoryStore.barbers[idx];
  },

  async findByIdAndDelete(id) {
    if (isMongoActive()) return await BarberModel.findByIdAndDelete(id);
    const idx = memoryStore.barbers.findIndex((b) => String(b._id) === String(id));
    if (idx === -1) return null;
    return memoryStore.barbers.splice(idx, 1)[0];
  },

  async countDocuments(query = {}) {
    if (isMongoActive()) return await BarberModel.countDocuments(query);
    if (query.isActive !== undefined) {
      return memoryStore.barbers.filter((b) => b.isActive === query.isActive).length;
    }
    return memoryStore.barbers.length;
  },
};

// ================= APPOINTMENT ADAPTER =================
const Appointment = {
  async find(query = {}) {
    if (isMongoActive()) {
      return await AppointmentModel.find(query).sort({ date: -1, createdAt: -1 });
    }
    let list = [...memoryStore.appointments];

    if (query.date) {
      if (typeof query.date === 'string') {
        list = list.filter((a) => a.date === query.date);
      } else if (query.date.$gte && query.date.$lte) {
        list = list.filter((a) => a.date >= query.date.$gte && a.date <= query.date.$lte);
      }
    }
    if (query.status) {
      if (query.status.$ne) {
        list = list.filter((a) => a.status !== query.status.$ne);
      } else {
        list = list.filter((a) => a.status === query.status);
      }
    }
    if (query['barber.barberId']) {
      list = list.filter((a) => String(a.barber?.barberId) === String(query['barber.barberId']));
    }
    if (query['customer.phone']) {
      list = list.filter((a) => String(a.customer?.phone) === String(query['customer.phone']));
    }
    if (query.$or) {
      list = list.filter((a) => {
        return query.$or.some((condition) => {
          if (condition.bookingId) return condition.bookingId.test(a.bookingId);
          if (condition['customer.name']) return condition['customer.name'].test(a.customer?.name || '');
          if (condition['customer.phone']) return condition['customer.phone'].test(a.customer?.phone || '');
          if (condition['barber.name']) return condition['barber.name'].test(a.barber?.name || '');
          return false;
        });
      });
    }

    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async findOne(query) {
    if (isMongoActive()) return await AppointmentModel.findOne(query);
    if (query.bookingId) {
      return memoryStore.appointments.find((a) => a.bookingId.toUpperCase() === query.bookingId.toUpperCase()) || null;
    }
    return null;
  },

  async findById(id) {
    if (isMongoActive()) return await AppointmentModel.findById(id);
    return memoryStore.appointments.find((a) => String(a._id) === String(id)) || null;
  },

  async create(data) {
    if (isMongoActive()) return await AppointmentModel.create(data);
    const newAppt = {
      _id: 'appt_' + Date.now(),
      status: 'Scheduled',
      createdAt: new Date(),
      ...data,
    };
    memoryStore.appointments.unshift(newAppt);
    return newAppt;
  },

  async findByIdAndUpdate(id, data, options = {}) {
    if (isMongoActive()) return await AppointmentModel.findByIdAndUpdate(id, data, options);
    const idx = memoryStore.appointments.findIndex((a) => String(a._id) === String(id));
    if (idx === -1) return null;
    memoryStore.appointments[idx] = { ...memoryStore.appointments[idx], ...data };
    return memoryStore.appointments[idx];
  },

  async countDocuments(query = {}) {
    if (isMongoActive()) return await AppointmentModel.countDocuments(query);
    let list = [...memoryStore.appointments];
    if (query.status) {
      list = list.filter((a) => a.status === query.status);
    }
    return list.length;
  },

  async aggregate(pipeline = []) {
    if (isMongoActive()) return await AppointmentModel.aggregate(pipeline);
    // Simple sum aggregator for revenue
    let list = [...memoryStore.appointments];
    for (const stage of pipeline) {
      if (stage.$match) {
        if (stage.$match.status) list = list.filter((a) => a.status === stage.$match.status);
        if (stage.$match.date) list = list.filter((a) => a.date === stage.$match.date);
      }
      if (stage.$group) {
        const total = list.reduce((sum, a) => sum + (a.totalAmount || 0), 0);
        return [{ _id: null, total }];
      }
    }
    return [{ _id: null, total: 0 }];
  },
};

module.exports = { User, Service, Barber, Appointment };
