import { createSignal, type Component, For } from 'solid-js';
import './style.css';

const App: Component = () => {
  
  //Form State
  const [services] = createSignal([
  ]);
  
  //Form State
  const [formData, setFormData] = createSignal({
    name: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    notes: '',
  });

  //Get Selected Service Details
  const selectedService = () => {
    return services().find(s => s.id === formData().service);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = formData();
    const service = selectedService();

    if (!data.name || !data.phone || !data.service || !data.date || !data.time) {
      alert('Please fill in all required fields.');
      return;
    }

    const message = `*New Booking!*%0A%0A
  *Client:* ${data.name}%0A
  *Phone:* ${data.phone}%0A
  *Service:* ${data.service}%0A
  *Date:* ${data.date}%0A
  *Time:* ${data.time}%0A
  *Notes:* ${data.notes || 'None'}`;

    const phone = '27820000000'
    window.open(`https://wa.me/${phone}?text=${message}`,'_blank');
  
  };

  return (
    <div class="container">
      <header class="hero">
        <h1>Coco's Braiding Bar</h1>
        <p>Book your appointment now</p>
      </header>

      <section>
        <h2>Book an Appointment</h2>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div class="form-group">
            <label for="name">Your name:</label>
            <input
              id="name"
              type="text"
              placeholder='e.g. Jane Doe'
              value={formData().name}
              oninput={(e) => serFormData({ ...formData(), name: e.currentTarget.value })}
              required
            />
          </div>

          {/* Phone */}
          <div class="form-group">
            <label for="phone">Phone Number:</label>
            <input
              id="phone"
              type="tel"
              placeholder='e.g. 0821234567'
              value={formData().phone}
              oninput={(e) => setFormData({ ...formData(), phone: e.currentTarget.value })}
              required
            />
          </div>

          {/* Services */}
          <div class="form-group">
            <label for="service">Select service:</label>
            <select
              id="service"
              value={formData().service}
              onChange={(e) => setFormData({ ...formData(), service: e.currentTarget.value })}
              required
            >
              <option value="">Choose a service</option>
              <For each={services()}>
                {(service) => (
                  <option value={service.id}>
                    {service.name} - R{service.price}
                  </option>
                )}
              </For>
            </select>
          </div>

          {/* Date */}
          <div class="form-group">
            <label for="date">Date:</label>
            <input
              id="date"
              type='date'
              value={formData().date}
              onInput={(e) => setFormData({ ...formData(), date: e.currentTarget.value })}
              required
            />
          </div>

          {/* Notes */}
          <div class="form-group">
            <label for="notes">Special requests (optional)</label>
            <textarea
              id="notes"
              placeholder='Additional Notes...'
              value={formData().notes}
              onInput={(e) => setFormData({ ...formData(), notes: e.currentTarget.value })}
              rows={3}
            />
          </div>

          {/* Price Summary */}
          <div class="price-summary">
            <h3>Total: R{selectedService()?.price || 0}</h3>
            {selectedService() && (
              <p class="service-detail">
                {selectedService()?.name}
              </p>
            )}
          </div>

          <button type="submit" class="submit-btn">
            Book via Whatsapp
          </button>
        </form>
      </section>
    </div>
  );
};

export default App;
