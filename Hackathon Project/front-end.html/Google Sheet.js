const scriptURL = 'https://script.google.com/macros/s/AKfycbwyQ_IUPCQ4yOd9qsc4ifLoRCUUrtmm5E-H-DWT-ToSD7rh7fkeLhnGE_wNIQ0doP536w/exec'

const form = document.forms['contact-form']

form.addEventListener('submit', e => {
  e.preventDefault()
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
  .then(response => alert("Thank you! Your form is submitted successfully." ))
  .then(() => { window.location.reload(); })
  .catch(error => console.error('Error!', error.message))
})