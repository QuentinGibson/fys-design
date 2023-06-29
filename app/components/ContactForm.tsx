export default function ContactForm() {
  return (
    <div className="max-w-lg mx-auto font-sauce">
      <div className="bg-secondary text-primary">
        <div className="flex flex-col items-center py-6">
          <h3 className="text-4xl w-3/4 text-center mb-8 font-body">Ready to get started?</h3>
          <p className="w-4/5 text-center">Schedule a free consultation with our team today.</p>
        </div>
        <div className="py-6 mx-4 grid grid-flow-row gap-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex flex-col text-sm">
              <label className="font-bold mb-2" htmlFor="firstName">First Name</label>
              <input className="py-4 px-5 text-primary placeholder:text-primary mx-1 border-[0.8px] border-primary/20" type="text" placeholder="First Name" />
            </div>
            <div className="flex flex-col text-sm">
              <label className="font-bold mb-2" htmlFor="lastName">Last Name</label>
              <input className="py-4 px-5 text-primary placeholder:text-primary mx-1 border-[0.8px] border-primary/20" type="text" placeholder="Last Name" />
            </div>
          </div>
          <div className="flex flex-col text-sm">
            <label className="font-bold mb-2 text-sm" htmlFor="service">Service you are insterested in</label>
            <input className="py-4 px-5 text-primary placeholder:text-primary mx-1 border-[0.8px] border-primary/20" type="text" placeholder="Service you are interested in" />
          </div>
          <div className="flex flex-col text-sm">
            <label className="font-bold mb-2 text-sm" htmlFor="email">Email Address</label>
            <input className="py-4 px-5 text-primary placeholder:text-primary mx-1 border-[0.8px] border-primary/20" type="text" placeholder="Email Address" />
          </div>
          <div className="flex flex-col">
            <button className="py-3 px-6 bg-primary text-white font-bold text-lg">Submit</button>
          </div>
          <div className="flex flex-col">
            <p className="text-primary text-[12px] font-medium">* We don't share your data.</p>
          </div>
        </div>
      </div>
    </div>
  );
};