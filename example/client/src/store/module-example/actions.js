import axios from 'axios';

export default function actions() {
  return {
    test({commit}, payload) {
      commit('TEST', payload);
    },
    findTodos({commit}, params) {
      axios.get('http://localhost:3030/todos',{params: params.query})
        .then(res => {
          commit('SET_TODOS', res.data);
        })
        .catch(err => {
          console.log('findTodos err:', err);
        });
    }
  };
}
