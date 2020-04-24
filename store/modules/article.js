import { commuLike } from '@/apis/commu.js' 

export default {
	namespaced: true,
	state: {
		lists: {},
		index: {}
	},
	mutations: {
		UPDATA(state, payload) {
			state.lists = payload
		},
		LIKE(state, payload) {
			state.lists[payload.listsIndex][payload.commuIndex].like = !state.lists[payload.listsIndex][payload.commuIndex].like
			commuLike({ 
				type: 0,
				id: state.lists[payload.listsIndex][payload.commuIndex].id, 
				status: state.lists[payload.listsIndex][payload.commuIndex].like ? 1 : 0
			})
		},
		COLLECTION(state, payload) {
			state.lists[payload.listsIndex][payload.commuIndex].collection = !state.lists[payload.listsIndex][payload.commuIndex].collection
			commuLike({
				type: 1,
				id: state.lists[payload.listsIndex][payload.commuIndex].id,
				status: state.lists[payload.listsIndex][payload.commuIndex].collection ? 1 : 0,
			})
		},
		ADDINDEX(state, payload) {
			state.index = payload
		},
		LIKEINDEX(state) {
			state.index.like = !state.index.like
			commuLike({ type: 0, id: state.index.id, status: state.index.like ? 1 : 0 })
		},
		COLLECTIONINDEX(state) {
			state.index.collection = !state.index.collection
			commuLike({ type: 1, id: state.index.id, status: state.index.collection ? 1 : 0 })
		},
	}
}
