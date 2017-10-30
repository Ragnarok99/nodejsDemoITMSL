import fetch from "isomorphic-fetch";

const baseURL = "http://localhost:3000";

const api = {

  tasks: {
    async getList() {
      const response = await fetch(`${baseURL}/api/tasks`);
      const data = await response.json();

      return data;
    },
    async addNew(task) {
      console.log(task)
      const response = await fetch(`${baseURL}/api/new_task`, {
        method: 'POST',
        body: JSON.stringify(task),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      //console.log(response); see the status
      return data[0];
    },
    async deleteTask(id){
      const response = await fetch(`${baseURL}/api/remove_task`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: id})
      });
      const data = await response.json();

      return data;
    },
    async updateTask(taskModified) {
      const response = await fetch(`${baseURL}/api/update_task`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskModified)
      });
      const data = await response.json();

      return data;
    }
  }
};

export default api;
