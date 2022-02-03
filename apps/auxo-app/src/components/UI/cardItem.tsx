const CardItem = (props: { left: string, right: string, loading?: boolean }) => {
  return (
      <>{ 
        !props.loading
        ? 
          <div className="flex justify-between w-full">
              <p className="ml-2">{props.left}</p>
                <p className="mr-2 font-bold">{props.right}</p>
          </div>
        : <p>Loading...</p>
      }</>
  )
}

export default CardItem