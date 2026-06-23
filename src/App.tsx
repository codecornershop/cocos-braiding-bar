import { createSignal, type Component, For, onMount, onCleanup } from 'solid-js';
import './style.css';

const App: Component = () => {
  
  //Form State
  const [services] = createSignal([
    {
      id: 'knotless', 
      name: 'Knotless Braids', 
      price: 400,
      priceNote: 'R400+'
    },
    {
      id: 'boho', 
      name: 'Boho Braids', 
      price: 400,
      priceNote: null
    },
    {
      id: 'french-curls', 
      name: 'French Curls', 
      price: 400,
      priceNote: null
    },
    {
      id: 'twists', 
      name: 'Twists', 
      price: 400,
      priceNote: 'R400+'
    },
    {
      id: 'cornrows', 
      name: 'Cornrows', 
      price: 250,
      priceNote: 'R250+'
    }
  ]);

  const [addOns] = createSignal([
    {id: 'hair', name: 'Hair Included', price: 100},
    {id: 'beads', name: 'Beads', price: 50},
    {id: 'curls', name: 'Curls', price: 50},
    {id: 'length', name: 'Extra Length', price: 100},
    {id: 'house-call', name: 'House Call', price: 100}
  ]);

  const [showAddOns, setShowAddOns] = createSignal(false);
  
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

  const [selectedAddOns, setSelectedAddOns] = createSignal<string[]>([]);

  const toggleAddOn = (id:string) => {
    setSelectedAddOns(prev =>
                     prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const totalPrice = () => {
    const servicePrice = selectedService()?.price || 0;
    const addOnsTotal = addOns()
      .filter(a => selectedAddOns().includes(a.id))
      .reduce((sum, a) => sum + a.price, 0);
    return servicePrice + addOnsTotal;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = formData();
    const service = selectedService();

    if (!data.name || !data.phone || !data.service || !data.date ) {
      alert('Please fill in all required fields.');
      return;
    }

    const addOnsList = addOns()
      .filter(a => selectedAddOns().includes(a.id))
      .map(a => a.name)
      .join(', ');

    const servicePriceDisplay = service?.priceNote || `R${service?.price}`;

    const message = `*New Booking!*%0A%0A
    *Client:* ${data.name}%0A
    *Phone:* ${data.phone}%0A
    *Service:* ${service?.name} (${servicePriceDisplay}) %0A
    *Add-ons:* ${addOnsList || 'None'}%0A
    *Approximate Total:* R${totalPrice()}%0A
    *Date:* ${data.date}%0A
    *Notes:* ${data.notes || 'None'}`;

    const phone = '27743500478'
    window.open(`https://wa.me/${phone}?text=${message}`,'_blank');
  
  };

  const [isDark, setIsDark] = createSignal(false);

  onMount(() => {
    // Check user's system preference
    const darkMode = window.matchMedia('(prefers-color-scheme:dark)');
    setIsDark(darkMode.matches);

    // Listen for changes
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    darkMode.addEventListener('change', handler);

    onCleanup(() => darkMode.removeEventListener('change', handler));
  });

  return (
    <div class="container">
      <header class="hero">
        <h1 class="sr-only">Coco's Braiding Bar</h1>
        <div class="hero-logo">
          <img 
            src={isDark() ? `${import.meta.env.BASE_URL}logo-dark-mode.svg` : `${import.meta.env.BASE_URL}logo-light-mode.svg`} 
            alt="coco's braiding bar logo" 
            class="logo" 
          />
        </div>
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
              oninput={(e) => setFormData({ ...formData(), name: e.currentTarget.value })}
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
                    {service.name} - {service.priceNote || `R${service.price}`}
                  </option>
                )}
              </For>
            </select>
          </div>

          {/* Add Ons */}
          <p class="add-on-label">Add-ons (optional): </p>
          <fieldset class="form-group collapsible-addons">
            <legend class="section-header" onClick={() => setShowAddOns(!showAddOns())}>
              <span class="form-label">Choose add-on</span>
              <span class="toggle-icon" style={{ transform: showAddOns() ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
                ▾
              </span>
            </legend>
            {showAddOns() && (
              <div class="section-content">
                <For each={addOns()}>
                  {(addOn) => (
                    <label class="checkbox-option">
                      <span class="addon-label">
                        <span>{addOn.name}</span>
                        <span class="addon-price">+R{addOn.price}</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={selectedAddOns().includes(addOn.id)}
                        onChange={() => toggleAddOn(addOn.id)}
                      />
                    </label>
                  )}
                </For>
              </div>
            )}
          </fieldset>

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
            <h3>Approximate Total: R{totalPrice()}</h3>
            <p class="service-detail">
              {selectedService()?.name}
              {selectedAddOns().length > 0 && (
                <span> + {selectedAddOns().map(id => addOns().find(a => a.id === id)?.name).join(', ')}</span>
              )}
            </p>
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
