document.getElementById('message-element').textContent = 'Loading...';

getCars().then(cars => {
  const message = generateReport(cars, 2000);
  document.getElementById('message-element').textContent = message;
});