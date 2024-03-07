const LoginForm = ({
  username,
  password,
  handleSetUsername,
  handleSetPassword,
  handleLogin,
}) => (
  <form data-testid='login-form' onSubmit={handleLogin}>
    <div>
      username{' '}
      <input
        type='text'
        value={username}
        name='Username'
        data-testid='username'
        onChange={handleSetUsername}
      />
    </div>
    <div>
      password{' '}
      <input
        type='password'
        value={password}
        name='Password'
        data-testid='password'
        onChange={handleSetPassword}
      />
    </div>
    <button type='submit'>login</button>
  </form>
)

export default LoginForm
