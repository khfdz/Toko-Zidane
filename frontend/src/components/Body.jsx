const Body = () => {
  return (
    <main className="container mx-auto p-4">
      <section id="home" className="py-12">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">Welcome to Our Website</h1>
        <p className="text-lg md:text-xl text-gray-600">
          We offer a wide range of services to help you achieve your goals. Explore our site to learn more.
        </p>
      </section>
      <section id="about" className="py-12">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">About Us</h2>
        <p className="text-lg md:text-xl text-gray-600">
          We are a team of professionals dedicated to providing top-notch services to our clients.
        </p>
      </section>
    </main>
  );
};

export default Body;
