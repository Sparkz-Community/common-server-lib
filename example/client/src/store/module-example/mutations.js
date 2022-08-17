export default function mutations() {
  return {
    TEST(state, payload) {
      state.test = payload;
    },
    SET_TODOS(state, payload) {
      state.todos = payload.data;
    }
  };
}
