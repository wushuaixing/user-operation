import { createStore } from "vuex";
import AdminApi from "@/server/api/admin";
export default createStore({
  state: {
    toBeAllocatedNum:0,
  },
  mutations: {
    getNumMutation(state,data){
      state.toBeAllocatedNum = data;
    }
  },
  actions: {
    getNumAction({commit}){
      AdminApi.getNum().then((res) => {
        const { data } = res.data || {};
        commit("getNumMutation",data);
      });
    }
  },
});
