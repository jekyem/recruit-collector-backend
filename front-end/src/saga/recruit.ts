import { all, put, takeLatest, fork } from "redux-saga/effects";
import RecruitAction from "reducers/recruit/action";
import axios from "axios";

function* getRecruits(action: any) {
  try {
    const request = yield axios.get(
      "http://recruit-collector.southeastasia.cloudapp.azure.com/api/recruits",
      {
        params: {
          searchTerm: action.payload.searchTerm,
          offset: action.payload.offset,
          limit: action.payload.limit
        }
      }
    );
    yield put({
      type: RecruitAction.GET_RECRUITS_SUCCESS,
      payload: {
        pageList: request.data.recruits,
        total: request.data.total
      }
    });
  } catch (e) {
    yield put({
      type: RecruitAction.GET_RECRUITS_FAILURE,
      payload: e
    });
  }
}

function* watchGetRecruits() {
  yield takeLatest(RecruitAction.GET_RECRUITS_REQUEST, getRecruits);
}

export default function* recruitSaga() {
  yield all([fork(watchGetRecruits)]);
}
