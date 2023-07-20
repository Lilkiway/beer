import './Error.scss';

export const Error = (props) => {
  const { error } = props;

  return <h2 className='error'>Error: {error}</h2>
}