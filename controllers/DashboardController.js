const DashboardController = {
  index: (req, res) => {
    res.render('dashboard/index', {
      title: 'Dashboard',
      user: req.user
    });
  }
};

module.exports = DashboardController;