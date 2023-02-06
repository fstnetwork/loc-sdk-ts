import {
  DatabaseAgent,
  GenericLogic,
  Logic,
  LoggingAgent,
  RailwayError,
  SessionStorageAgent,
} from '@fstnetwork/logic';

@Logic()
export default class TestDatabase extends GenericLogic {
  async run() {
    LoggingAgent.info('test TestDatabase');

    await this.testQuery();
    await this.testExecute();
  }

  async testQuery() {
    try {
      const db = await DatabaseAgent.acquire('test-oracle-db');
      const resp = await db?.query(
        'SELECT * FROM saffron_runtime.tables WHERE 1=1;',
        []
      );
      if (resp !== undefined) {
        await SessionStorageAgent.putJson(
          'database_test_query_resp_columns',
          resp?.columns
        );
        await SessionStorageAgent.putJson(
          'database_test_query_resp_rows',
          resp?.rows
        );
      }
    } catch (error) {
      await SessionStorageAgent.putString(
        'database_test_query_error',
        `Failed to query SQL on Database: ${error}`
      );
    }
  }

  async testExecute() {
    try {
      const db = await DatabaseAgent.acquire('test-oracle-db');

      await db?.beginTransaction();
      const resp = await db?.execute(
        'INSERT INTO saffron_runtime.tables(id, name) VALUES ($1, $2);',
        [4, 'usada']
      );
      await SessionStorageAgent.putJson('database_test_execute_resp', resp);
      await db?.commitTransaction();
      await db?.release();
    } catch (error) {
      await SessionStorageAgent.putString(
        'database_test_execute_error',
        `Failed to execute SQL on Database: ${error}`
      );
    }
  }

  async handleError(error: RailwayError) {
    LoggingAgent.error(`${error}`);
  }
}
