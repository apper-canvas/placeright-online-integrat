class ApplicationService {
  constructor() {
    this.tableName = 'application_c';
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
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "applied_date_c"}},
          {"field": {"Name": "cover_letter_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "interviews_c"}},
          {"field": {"Name": "job_id_c"}},
          {"field": {"Name": "candidate_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching applications:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching applications:", error?.response?.data?.message || error);
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
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "applied_date_c"}},
          {"field": {"Name": "cover_letter_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "interviews_c"}},
          {"field": {"Name": "job_id_c"}},
          {"field": {"Name": "candidate_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error("Error fetching application:", response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching application ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(applicationData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields, handle lookup fields as integers
      const payload = {
        records: [{
          Name: applicationData.Name || `Application for Job ${applicationData.job_id_c}`,
          Tags: applicationData.Tags || '',
          status_c: applicationData.status_c || applicationData.status || 'Applied',
          applied_date_c: applicationData.applied_date_c || applicationData.appliedDate || new Date().toISOString(),
          cover_letter_c: applicationData.cover_letter_c || applicationData.coverLetter || '',
          notes_c: applicationData.notes_c || applicationData.notes || '',
          interviews_c: applicationData.interviews_c || applicationData.interviews || '',
          job_id_c: parseInt(applicationData.job_id_c || applicationData.jobId),
          candidate_id_c: parseInt(applicationData.candidate_id_c || applicationData.candidateId)
        }]
      };

      const response = await apperClient.createRecord(this.tableName, payload);
      
      if (!response.success) {
        console.error("Error creating application:", response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} applications:`, failed);
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating application:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, applicationData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields, handle lookup fields as integers
      const payload = {
        records: [{
          Id: parseInt(id),
          Name: applicationData.Name || `Application for Job ${applicationData.job_id_c}`,
          Tags: applicationData.Tags || '',
          status_c: applicationData.status_c || applicationData.status || 'Applied',
          applied_date_c: applicationData.applied_date_c || applicationData.appliedDate || '',
          cover_letter_c: applicationData.cover_letter_c || applicationData.coverLetter || '',
          notes_c: applicationData.notes_c || applicationData.notes || '',
          interviews_c: applicationData.interviews_c || applicationData.interviews || '',
          job_id_c: parseInt(applicationData.job_id_c || applicationData.jobId),
          candidate_id_c: parseInt(applicationData.candidate_id_c || applicationData.candidateId)
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, payload);
      
      if (!response.success) {
        console.error("Error updating application:", response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} applications:`, failed);
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating application:", error?.response?.data?.message || error);
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
        console.error("Error deleting application:", response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} applications:`, failed);
        }
        
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting application:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export default new ApplicationService();