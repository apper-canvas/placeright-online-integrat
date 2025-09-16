class MessageService {
  constructor() {
    this.messageTable = 'message_c';
    this.conversationTable = 'conversation_c';
  }

  async getConversations() {
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
          {"field": {"Name": "participant_name_c"}},
          {"field": {"Name": "job_title_c"}},
          {"field": {"Name": "last_message_c"}},
          {"field": {"Name": "last_message_time_c"}},
          {"field": {"Name": "unread_count_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "last_message_time_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords(this.conversationTable, params);
      
      if (!response.success) {
        console.error("Error fetching conversations:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching conversations:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getMessages(conversationId) {
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
          {"field": {"Name": "sender_id_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "read_c"}},
          {"field": {"Name": "conversation_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{"FieldName": "conversation_id_c", "Operator": "EqualTo", "Values": [parseInt(conversationId)]}],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "ASC"}]
      };

      const response = await apperClient.fetchRecords(this.messageTable, params);
      
      if (!response.success) {
        console.error("Error fetching messages:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching messages:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(messageData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const timestamp = new Date().toISOString();

      // Only include Updateable fields, handle lookup field as integer
      const payload = {
        records: [{
          Name: `Message ${Date.now()}`,
          Tags: '',
          sender_id_c: messageData.sender_id_c || messageData.senderId || 0,
          content_c: messageData.content_c || messageData.content || '',
          timestamp_c: timestamp,
          read_c: false,
          conversation_id_c: parseInt(messageData.conversation_id_c || messageData.conversationId)
        }]
      };

      const response = await apperClient.createRecord(this.messageTable, payload);
      
      if (!response.success) {
        console.error("Error creating message:", response.message);
        return null;
      }

      let newMessage = null;
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} messages:`, failed);
        }
        
        newMessage = successful.length > 0 ? successful[0].data : null;
      }

      // Update conversation last message if message was created successfully
      if (newMessage) {
        await this.updateConversationLastMessage(
          parseInt(messageData.conversation_id_c || messageData.conversationId),
          messageData.content_c || messageData.content || '',
          timestamp
        );
      }

      return newMessage;
    } catch (error) {
      console.error("Error creating message:", error?.response?.data?.message || error);
      return null;
    }
  }

  async updateConversationLastMessage(conversationId, content, timestamp) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const payload = {
        records: [{
          Id: conversationId,
          last_message_c: content,
          last_message_time_c: timestamp
        }]
      };

      const response = await apperClient.updateRecord(this.conversationTable, payload);
      
      if (!response.success) {
        console.error("Error updating conversation:", response.message);
      }
    } catch (error) {
      console.error("Error updating conversation:", error?.response?.data?.message || error);
    }
  }

  async markAsRead(messageId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const payload = {
        records: [{
          Id: parseInt(messageId),
          read_c: true
        }]
      };

      const response = await apperClient.updateRecord(this.messageTable, payload);
      
      if (!response.success) {
        console.error("Error marking message as read:", response.message);
return false;
      }
      return true;
    } catch (error) {
      console.error("Error marking message as read:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export default new MessageService();