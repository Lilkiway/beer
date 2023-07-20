import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import useBeerStore from "../../data/stores/useBeerStore";

import './BeerList.scss';
import { Error } from "../Error";

export const BeerList = () => {
  const [
    allBeer,
    renderBeer,
    getBeer,
    handleDelete,
    page,
    error,
  ] = useBeerStore(state => [
    state.allBeer,
    state.renderBeer,
    state.getBeer,
    state.handleDelete,
    state.page,
    state.error,
  ])

  useEffect(() => {
    if(!allBeer.length && page !== 13) {
      getBeer(page + 1);
    }
  }, [allBeer.length, page, getBeer]);

  const listRef = useRef();
  const [deleteIds, setDeleteIds] = useState([]);

  // adds a class to the selected elements 
  // adds or delete the IDs to be removed to the array
  const handleSelectedIds = (e) => {
    e.preventDefault();
    const target = e.currentTarget;

    if (!target.classList.contains('beer_box__selected')) {
      setDeleteIds([...deleteIds, +target.id]);
      target.classList.add('beer_box__selected');
    } else {
      const deselectedIds = deleteIds.filter((id) => id !== +target.id);
      setDeleteIds(deselectedIds);
      target.classList.remove('beer_box__selected');
    }
  }

  // handle list scrolling
  // remove the first five IDs from the list
  // delete of selected IDs from the deleteIds array if they no longer exist
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;

    if ((scrollTop + clientHeight) === scrollHeight && page !== 13) {
      const fiveDeleteIds = renderBeer.slice(0,5).map(el => el.id);
      handleDelete(fiveDeleteIds);

      const deleteRemovedIds = deleteIds.filter(id => !fiveDeleteIds.includes(id));
      setDeleteIds(deleteRemovedIds);
    }
  }

  // remove the selected elements and clear the array after
  const onHandleDelete = () => {
    handleDelete(deleteIds);
    setDeleteIds([]);
  }

  if(error) {
    return  <Error error={error} />
   }

  return (
    <main className="beer_wrapper">
      <header>
        {deleteIds.length ? 
          <button onClick={onHandleDelete}>Delete</button> : 
          <h1>Beer Recipes</h1>
        }
      </header>
      <ul className="beer_content" onScroll={handleScroll} ref={listRef}>
        {renderBeer.length === 15 ? renderBeer.map(oneBeer => {
          return (
            <li 
              id={oneBeer.id}
              key={oneBeer.id} 
              className="beer_box"
              onContextMenu={handleSelectedIds}
            >
              <Link to={`/beer/${oneBeer.id}`}>
                <div className="beer_box__desc">
                  <div className="beer_box__header">
                    <h2>{oneBeer.name}<span> / {oneBeer.abv} abv</span></h2>
                  </div>
                    <p>{oneBeer.description}</p>
                </div>
              </Link>
            </li>
          )
        }) : <div className="beer_loading">Loading...</div>}
      </ul>
    </main>
  );
}