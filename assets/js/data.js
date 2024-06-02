import axios from 'axios'
const base = process.env.base;
const authCredentials = process.env.authCredentials;
import stateIDs from './stateId.json'

class Statitics {
    static async compute(){
        let clients = await this.getClients();
        let clientList = this.replaceState(clients, stateIDs);
        clientList = this.convertData(clientList);
        return clientList;
    }

    static getClients(){
      let api = `${base}/customer/allclients`;
      return new Promise(async (resolve, reject) => {
        try {
          let response = await axios.get(api, {
            credentials: true,
            auth: {
              username: authCredentials.username,
              password: authCredentials.password
            }
          });
          resolve(response.data);
        } catch (error) {
          reject(error.response);
        }
      });
    }

    static getReport(){
      let api = `${base}/customer/report`;
      return new Promise(async (resolve, reject) => {
        try {
          let response = await axios.get(api, {
            credentials: true,
            auth: {
              username: authCredentials.username,
              password: authCredentials.password
            }
          });
          resolve(response.data);
        } catch (error) {
          reject(error.response);
        }
      });
    }

    static getAllOpportunities(){
      let api = `${base}/lead/allopportunities`;
      return new Promise(async (resolve, reject) => {
        try {
          let response = await axios.get(api, {
            credentials: true,
            auth: {
              username: authCredentials.username,
              password: authCredentials.password
            }
          });
          resolve(response.data);
        } catch (error) {
          reject(error.response);
        }
      });
    }

    static getForecast(){
      let api = `${base}/lead/forecast`;
      return new Promise(async (resolve, reject) => {
        try {
          let response = await axios.get(api, {
            credentials: true,
            auth: {
              username: authCredentials.username,
              password: authCredentials.password
            }
          });
          resolve(response.data);
        } catch (error) {
          reject(error.response);
        }
      });
    }

    static getAllReports(){
      let api = `${base}/customer/allreports`;
      return new Promise(async (resolve, reject) => {
        try {
          let response = await axios.get(api, {
            credentials: true,
            auth: {
              username: authCredentials.username,
              password: authCredentials.password
            }
          });
          resolve(response.data);
        } catch (error) {
          reject(error.response);
        }
      });
    }

    static getAllActiveClients(){
      let api = `${base}/customer/activeclients`;
      return new Promise(async (resolve, reject) => {
        try {
          let response = await axios.get(api, {
            credentials: true,
            auth: {
              username: authCredentials.username,
              password: authCredentials.password
            }
          });
          resolve(response.data);
        } catch (error) {
          reject(error.response);
        }
      });
    }

    static replaceState(originalObject, stateIdMapping) {
      for(let j = 0; j < originalObject.length; j++){
        for (let i = 0; i < stateIdMapping.length; i++) {
          if (originalObject[j].state.trim() == stateIdMapping[i].name) {
            originalObject[j].state = stateIdMapping[i].id;
            break;
          }
        }
      };
      return originalObject;
    }

    static convertData(data){
      return data.reduce((acc, item) => {
        let id = item.state.trim();
        let dso = item.dso ? 1 : 0;
        let rcm = item.rcm ? 1 : 0;
        let totalTeamMembers = item.totalTeamMembers;
        let locations = item.numberOfLocations;
        let dental = item.industry == "Dental" ? 1 : 0;
      
        let existingState = acc.find(state => state.id === id);
      
        if (!existingState) {
          acc.push({
            id: id,
            value: 1,
            dso: dso,
            rcm: rcm,
            dental: dental,
            locations: locations,
            totalTeamMembers: totalTeamMembers,
          });
        } else {
          existingState.value++;
          existingState.dso += dso;
          existingState.rcm += rcm;
          existingState.dental += dental;
          existingState.locations += locations;
          existingState.totalTeamMembers += totalTeamMembers;
        }
      
        return acc;
      }, []);
    }
}
  
  export default Statitics;