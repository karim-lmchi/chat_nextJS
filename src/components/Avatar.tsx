import styles from '../styles/Avatar.module.css'

type AvatarType = {
  name: string,
}

export const Avatar = ({ name }: AvatarType) => {
  return (
    <div className={styles.container}>
      <p>{name ? name[0].toUpperCase() : ''}</p>
    </div>
  )
}