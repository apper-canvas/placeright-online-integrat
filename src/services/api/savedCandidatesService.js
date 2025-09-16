class SavedCandidatesService {
  constructor() {
    this.tableName = 'saved_candidate_c';
    // Mock current user ID - in real app this would come from auth context
    this.currentUserId = 1;
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
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "saved_at_c"}},
          {"field": {"Name": "candidate_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{"FieldName": "user_id_c", "Operator": "EqualTo", "Values": [this.currentUserId]}],
        orderBy: [{"fieldName": "saved_at_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching saved candidates:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching saved candidates:", error?.response?.data?.message || error);
      return [];
    }
  }

  async add(candidateId) {
    try {
      // Check if already saved
      const alreadySaved = await this.checkSaved(candidateId);
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
          Name: `Saved Candidate ${candidateId}`,
          Tags: '',
          user_id_c: this.currentUserId,
          saved_at_c: new Date().toISOString(),
          candidate_id_c: parseInt(candidateId)
        }]
      };

      const response = await apperClient.createRecord(this.tableName, payload);
      
      if (!response.success) {
        console.error("Error saving candidate:", response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to save ${failed.length} candidates:`, failed);
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error saving candidate:", error?.response?.data?.message || error);
      return null;
    }
  }

  async remove(candidateId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // First find the saved candidate record
      const params = {
        fields: [{"field": {"Name": "Id"}}],
        where: [
          {"FieldName": "candidate_id_c", "Operator": "EqualTo", "Values": [parseInt(candidateId)]},
          {"FieldName": "user_id_c", "Operator": "EqualTo", "Values": [this.currentUserId]}
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success || !response.data || response.data.length === 0) {
        return false; // Not found
      }

      // Delete the saved candidate record
      const deleteParams = { 
        RecordIds: response.data.map(record => record.Id)
      };

      const deleteResponse = await apperClient.deleteRecord(this.tableName, deleteParams);
      
      if (!deleteResponse.success) {
        console.error("Error removing saved candidate:", deleteResponse.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error removing saved candidate:", error?.response?.data?.message || error);
      return false;
    }
  }

  async checkSaved(candidateId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [{"field": {"Name": "Id"}}],
        where: [
          {"FieldName": "candidate_id_c", "Operator": "EqualTo", "Values": [parseInt(candidateId)]},
          {"FieldName": "user_id_c", "Operator": "EqualTo", "Values": [this.currentUserId]}
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error checking saved candidate:", response.message);
        return false;
      }

      return (response.data || []).length > 0;
    } catch (error) {
      console.error("Error checking saved candidate:", error?.response?.data?.message || error);
      return false;
    }
  }

  // Get saved candidate by candidate ID
  async getByCandidateId(candidateId) {
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
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "saved_at_c"}},
          {"field": {"Name": "candidate_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [
          {"FieldName": "candidate_id_c", "Operator": "EqualTo", "Values": [parseInt(candidateId)]},
          {"FieldName": "user_id_c", "Operator": "EqualTo", "Values": [this.currentUserId]}
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success || !response.data || response.data.length === 0) {
        return null;
      }

      return response.data[0];
    } catch (error) {
      console.error("Error getting saved candidate:", error?.response?.data?.message || error);
      return null;
    }
  }

  // Get count of saved candidates for current user
  async getCount() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [{"field": {"Name": "Id"}}],
        where: [{"FieldName": "user_id_c", "Operator": "EqualTo", "Values": [this.currentUserId]}]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error getting saved candidates count:", response.message);
        return 0;
      }

      return (response.data || []).length;
    } catch (error) {
      console.error("Error getting saved candidates count:", error?.response?.data?.message || error);
      return 0;
    }
  }
}

export default new SavedCandidatesService();