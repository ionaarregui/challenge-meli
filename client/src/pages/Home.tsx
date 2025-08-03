import styles from './Home.module.scss'

export default function Home() {
  //TODO carrousel de  destacados
  return (
    <div>
      <img
        className={styles.banner}
        src="https://http2.mlstatic.com/D_NQ_659968-MLA87448511259_072025-OO.webp"
        alt="Imagen que muestra un caja de envios abierta junto a una leyenda que indica envio gratis en tu primera compra comprando desde la app"
      />
    </div>
  )
}
