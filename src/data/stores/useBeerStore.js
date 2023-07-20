import axios from "axios";
import { create } from "zustand";

const useBeerStore = create((set, get) => ({
  allBeer: [],
  renderBeer: [],
  oneBeer: null,
  page: 0,
  error: null,

  getBeer: async (page) => {
    const { renderBeer, allBeer } = get();

    axios.get(`https://api.punkapi.com/v2/beers?page=${page}`)
      .then(result => {
        const data = result.data;

        const missingBeerCount = 15 - renderBeer.length;
        const fullRenderBeer = data.slice(0, missingBeerCount);
        const fullAllBeer = data.slice(missingBeerCount);
        
        set({ allBeer: [...allBeer, ...fullAllBeer], renderBeer: [...renderBeer, ...fullRenderBeer], page: page, error: null });
      })
      .catch(err => {
        if(err.response) {
          set({ error: err.response.status })
        }
      })
  },
  getOneBeer: async (id) => {
    axios.get(`https://api.punkapi.com/v2/beers/${id}`)
      .then(result => {
        const data = result.data[0];

        set({ oneBeer: data, error: null });
      })
      .catch(err => {
        if(err.response) {
          set({ error: err.response.status })
        }
      })
  },
  handleDelete: (ids) => {
    const { renderBeer, allBeer } = get();

    const filteredBeer = renderBeer.filter(item => !ids.includes(item.id));

    if(allBeer.length) {
      const filteredRenderBeer = [...filteredBeer, ...allBeer.slice(-ids.length)];
      const filteredAllBeer =  allBeer.slice(0, -ids.length);

      set({ renderBeer: filteredRenderBeer, allBeer: filteredAllBeer });
    } else {
      set({ renderBeer: filteredBeer });
    }
  },
}));

export default useBeerStore;