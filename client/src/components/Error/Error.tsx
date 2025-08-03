export default function Error({ message }: { message?: string }) {
  return (
    <div>{message ? message : <p>Parece que esta página no existe</p>}</div>
  )
}
