export default function Register() {
  return (
    <section>
      <form>
        <label htmlFor="username">username</label>
        <input type="text" placeholder="username" name="username" />
        <label htmlFor="password">password</label>
        <input type="password" placeholder="password" name="password" />
        <label htmlFor="email">email</label>
        <input type="text" placeholder="email" name="email" />
        <label htmlFor="firstName">First name</label>
        <input type="text" placeholder="First name" name="firstName" />
        <label htmlFor="lastName">Last name</label>
        <input type="text" placeholder="Last name" name="lastName" />
      </form>
    </section>
  );
}
