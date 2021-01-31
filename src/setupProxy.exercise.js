// Redirect by express
module.exports = app => {
	app.get(/^\/$/, (req, res) => res.redirect('/discover'))
}
