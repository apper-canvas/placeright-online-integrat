class SavedJobsService {
  constructor() {
    this.tableName = 'saved_job_c';
  }

  // Get all saved jobs for current user
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
          {"field": {"Name": "saved_at_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "job_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching saved jobs:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching saved jobs:", error?.response?.data?.message || error);
      return [];
    }
  }

  // Check if a job is saved
  async isSaved(jobId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [{"field": {"Name": "job_id_c"}}],
        where: [{"FieldName": "job_id_c", "Operator": "EqualTo", "Values": [parseInt(jobId)]}]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error checking saved job:", response.message);
        return false;
      }

      return (response.data || []).length > 0;
    } catch (error) {
      console.error("Error checking saved job:", error?.response?.data?.message || error);
      return false;
    }
  }

  // Add a job to saved jobs
  async add(jobId) {
    try {
      // Check if already saved
      const alreadySaved = await this.isSaved(jobId);
      if (alreadySaved) {
        return false; // Already saved
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields, handle lookup field as integer
      const payload = {
        records: [{
          Name: `Saved Job ${jobId}`,
          Tags: '',
          saved_at_c: new Date().toISOString(),
          user_id_c: 1, // Mock user ID - in real app this would come from auth
          job_id_c: parseInt(jobId)
        }]
      };

      const response = await apperClient.createRecord(this.tableName, payload);
      
      if (!response.success) {
        console.error("Error saving job:", response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to save ${failed.length} jobs:`, failed);
        }
        
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error saving job:", error?.response?.data?.message || error);
      return false;
    }
  }

  // Remove a job from saved jobs
  async remove(jobId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // First find the saved job record
      const params = {
        fields: [{"field": {"Name": "Id"}}],
        where: [{"FieldName": "job_id_c", "Operator": "EqualTo", "Values": [parseInt(jobId)]}]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success || !response.data || response.data.length === 0) {
        return false; // Not found
      }

      // Delete the saved job record
      const deleteParams = { 
        RecordIds: response.data.map(record => record.Id)
      };

      const deleteResponse = await apperClient.deleteRecord(this.tableName, deleteParams);
      
      if (!deleteResponse.success) {
        console.error("Error removing saved job:", deleteResponse.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error removing saved job:", error?.response?.data?.message || error);
      return false;
    }
  }

  // Toggle saved status
  async toggle(jobId) {
    const isSaved = await this.isSaved(jobId);
    
    if (isSaved) {
      await this.remove(jobId);
      return false; // Now unsaved
    } else {
      await this.add(jobId);
      return true; // Now saved
    }
  }

  // Get saved jobs count
  async getCount() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [{"field": {"Name": "Id"}}]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error getting saved jobs count:", response.message);
        return 0;
      }

      return (response.data || []).length;
    } catch (error) {
      console.error("Error getting saved jobs count:", error?.response?.data?.message || error);
      return 0;
    }
  }
}

export default new SavedJobsService();