import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { Error } from "../Error";
import useBeerStore from "../../data/stores/useBeerStore";

import './OneBeer.scss';

export const OneBeer = () => {
  const [
    oneBeer,
    getOneBeer,
    error,
  ] = useBeerStore(state => [
    state.oneBeer,
    state.getOneBeer,
    state.error,
  ]);
  
  const { id } = useParams();
  const incorrectId = !oneBeer || +id !== oneBeer.id;

  useEffect(() => {
    if(incorrectId) {
      getOneBeer(id)
    }
  }, [id, getOneBeer, incorrectId])

  // remove point at the end of the sentence
  const onPointDeleter = (str) => {
    const pointPosition = str.indexOf('.');

    if((str.length - 1) === pointPosition) {
      return str.slice(0, pointPosition);
    }

    return str
  }

  if(incorrectId && error) {
    return  <Error error={error} />
   }
   
  if(incorrectId) {
    return (
      <div className="one-beer__loading">Loading...</div>
    )
  }

  return (
    <div className="one-beer_box">
      <div className="one-beer_box__header">
        <h2>{oneBeer.name}</h2>
        <span>{onPointDeleter(oneBeer.tagline)}</span>
      </div>

      <div className="one-beer_box__img">
        <img src={oneBeer.image_url} alt={oneBeer.name} />
      </div>

      <div className="one-beer__description">
        <ul>
          <h3>Ingridients</h3>
          {oneBeer.ingredients.hops.map((el, i) => 
            <li key={i}>
              <h4>{el.name} ({el.attribute})</h4>
              <p>amount: {el.amount.value} {el.amount.unit}</p>
              <p>add: {el.add}</p>
            </li>
          )}
        </ul>
        <ul>
          <h3>Method</h3>
          {oneBeer.method.mash_temp.map((el, i) => 
          <li key={i}>
            <h4>duration: {el.duration}</h4>
            <p>temp: {el.temp.value} {el.temp.unit}</p>
          </li>)}
          <li>
            <h4>fermentation:</h4> 
            <p>{oneBeer.method.fermentation.temp.value} {oneBeer.method.fermentation.temp.unit}</p>
          </li>
          <li>
            <h4>twist:</h4> 
            <p>{oneBeer.method.twist ? oneBeer.method.twist : '-'}</p>
          </li>
        </ul>
        <ul>
          <h3>Food Pairing</h3>
          {oneBeer.food_pairing.map((food, i) => 
            <li key={i}><p>{food}</p></li>
          )}
        </ul>
      </div>
    </div>
  )
}
