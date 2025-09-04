
import axios from "axios";
import { Api } from "./env";


const CallApi = axios.create({
    baseURL: Api,

  });

export default CallApi