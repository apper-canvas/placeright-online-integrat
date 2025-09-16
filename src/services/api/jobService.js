class JobService {
  constructor() {
    this.tableName = 'job_c';
  }

  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "requirements_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "salary_range_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "posted_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching jobs:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching jobs:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "requirements_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "salary_range_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "posted_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error("Error fetching job:", response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching job ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(jobData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const payload = {
        records: [{
          Name: jobData.Name || jobData.title_c || '',
          Tags: jobData.Tags || '',
          title_c: jobData.title_c || jobData.title || '',
          company_c: jobData.company_c || jobData.company || '',
          description_c: jobData.description_c || jobData.description || '',
          requirements_c: jobData.requirements_c || '',
          location_c: jobData.location_c || jobData.location || '',
          salary_range_c: jobData.salary_range_c || '',
          type_c: jobData.type_c || jobData.type || '',
          posted_date_c: jobData.posted_date_c || new Date().toISOString(),
          status_c: jobData.status_c || jobData.status || 'Active'
        }]
      };

      const response = await apperClient.createRecord(this.tableName, payload);
      
      if (!response.success) {
        console.error("Error creating job:", response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} jobs:`, failed);
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating job:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, jobData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const payload = {
        records: [{
          Id: parseInt(id),
          Name: jobData.Name || jobData.title_c || '',
          Tags: jobData.Tags || '',
          title_c: jobData.title_c || jobData.title || '',
          company_c: jobData.company_c || jobData.company || '',
          description_c: jobData.description_c || jobData.description || '',
          requirements_c: jobData.requirements_c || '',
          location_c: jobData.location_c || jobData.location || '',
          salary_range_c: jobData.salary_range_c || '',
          type_c: jobData.type_c || jobData.type || '',
          posted_date_c: jobData.posted_date_c || '',
          status_c: jobData.status_c || jobData.status || 'Active'
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, payload);
      
      if (!response.success) {
        console.error("Error updating job:", response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} jobs:`, failed);
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating job:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error deleting job:", response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} jobs:`, failed);
        }
        
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting job:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export default new JobService();