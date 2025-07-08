router.post('/', async (req, res) => {
  const newEntry = new Register(req.body);
  await newEntry.save();
  res.status(201).json({ message: 'Registered successfully' });
});
