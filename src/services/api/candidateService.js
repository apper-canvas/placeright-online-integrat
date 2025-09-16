class CandidateService {
  constructor() {
    this.tableName = 'candidate_c';
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "skills_c"}},
          {"field": {"Name": "experience_c"}},
          {"field": {"Name": "education_c"}},
          {"field": {"Name": "resume_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "preferences_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching candidates:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching candidates:", error?.response?.data?.message || error);
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "skills_c"}},
          {"field": {"Name": "experience_c"}},
          {"field": {"Name": "education_c"}},
          {"field": {"Name": "resume_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "preferences_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error("Error fetching candidate:", response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching candidate ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(candidateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const payload = {
        records: [{
          Name: candidateData.Name || candidateData.name_c || '',
          Tags: candidateData.Tags || '',
          name_c: candidateData.name_c || candidateData.name || '',
          email_c: candidateData.email_c || candidateData.email || '',
          phone_c: candidateData.phone_c || candidateData.phone || '',
          skills_c: candidateData.skills_c || '',
          experience_c: candidateData.experience_c || '',
          education_c: candidateData.education_c || '',
          resume_c: candidateData.resume_c || '',
          location_c: candidateData.location_c || candidateData.location || '',
          preferences_c: candidateData.preferences_c || '',
          description_c: candidateData.description_c || candidateData.description || ''
        }]
      };

      const response = await apperClient.createRecord(this.tableName, payload);
      
      if (!response.success) {
        console.error("Error creating candidate:", response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} candidates:`, failed);
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating candidate:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, candidateData) {
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
          Name: candidateData.Name || candidateData.name_c || '',
          Tags: candidateData.Tags || '',
          name_c: candidateData.name_c || candidateData.name || '',
          email_c: candidateData.email_c || candidateData.email || '',
          phone_c: candidateData.phone_c || candidateData.phone || '',
          skills_c: candidateData.skills_c || '',
          experience_c: candidateData.experience_c || '',
          education_c: candidateData.education_c || '',
          resume_c: candidateData.resume_c || '',
          location_c: candidateData.location_c || candidateData.location || '',
          preferences_c: candidateData.preferences_c || '',
          description_c: candidateData.description_c || candidateData.description || ''
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, payload);
      
      if (!response.success) {
        console.error("Error updating candidate:", response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} candidates:`, failed);
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating candidate:", error?.response?.data?.message || error);
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
        console.error("Error deleting candidate:", response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} candidates:`, failed);
        }
        
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting candidate:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export default new CandidateService();