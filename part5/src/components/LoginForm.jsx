const LoginForm = ({
  username,
  password,
  handleSetUsername,
  handleSetPassword,
  handleLogin,
}) => (
  <form onSubmit={handleLogin}>
    <div>
      username{' '}
      <input
        type='text'
        value={username}
        name='Username'
        onChange={handleSetUsername}
      />
    </div>
    <div>
      password{' '}
      <input
        type='password'
        value={password}
        name='Password'
        onChange={handleSetPassword}
      />
    </div>
    <button type='submit'>login</button>
  </form>
)

export default LoginForm
