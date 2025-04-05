const RedisQueue = require('../RedisQueue');

describe('RedisQueue', () => {
  let queue;
  let processor;

  beforeEach(() => {
    queue = RedisQueue();
    processor = jest.fn();
  });

  describe('add', () => {
    it('deve adicionar um job à fila com sucesso', async () => {
      // Arrange
      const data = { key: 'value' };
      const opts = { delay: 1000 };

      // Act
      const job = await queue.add(data, opts);

      // Assert
      expect(job).toBeDefined();
      expect(job.id).toBeDefined();
      expect(job.data).toEqual(data);
      expect(job.opts).toEqual(opts);
      expect(job.timestamp).toBeDefined();
    });

    it('deve adicionar um job sem opções', async () => {
      // Arrange
      const data = { key: 'value' };

      // Act
      const job = await queue.add(data);

      // Assert
      expect(job).toBeDefined();
      expect(job.id).toBeDefined();
      expect(job.data).toEqual(data);
      expect(job.opts).toEqual({});
    });
  });

  describe('process', () => {
    it('deve processar um job com sucesso', async () => {
      // Arrange
      const data = { key: 'value' };
      queue.process(processor);
      const job = await queue.add(data);

      // Act
      // Aguarda o processamento automático (que ocorre a cada 1 segundo)
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Assert
      expect(processor).toHaveBeenCalledWith(job);
      expect(job.processed).toBe(true);
      expect(job.status).toBe('completed');
    });

    it('deve marcar o job como falho quando o processamento falha', async () => {
      // Arrange
      const data = { key: 'value' };
      const error = new Error('Erro no processamento');
      processor.mockRejectedValue(error);
      queue.process(processor);
      const job = await queue.add(data);

      // Act
      // Aguarda o processamento automático
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Assert
      expect(processor).toHaveBeenCalledWith(job);
      expect(job.processed).toBe(true);
      expect(job.status).toBe('failed');
      expect(job.error).toBe(error.message);
    });
  });

  describe('getJob', () => {
    it('deve retornar um job pelo ID', async () => {
      // Arrange
      const data = { key: 'value' };
      const job = await queue.add(data);

      // Act
      const retrievedJob = await queue.getJob(job.id);

      // Assert
      expect(retrievedJob).toBeDefined();
      expect(retrievedJob.id).toBe(job.id);
      expect(retrievedJob.data).toEqual(data);
    });

    it('deve retornar undefined para um ID inexistente', async () => {
      // Act
      const job = await queue.getJob('non-existent-id');

      // Assert
      expect(job).toBeUndefined();
    });
  });

  describe('getJobs', () => {
    it('deve retornar todos os jobs', async () => {
      // Arrange
      const data1 = { key: 'value1' };
      const data2 = { key: 'value2' };
      await queue.add(data1);
      await queue.add(data2);

      // Act
      const jobs = await queue.getJobs();

      // Assert
      expect(jobs).toHaveLength(2);
      expect(jobs[0].data).toEqual(data1);
      expect(jobs[1].data).toEqual(data2);
    });

    it('deve retornar array vazio quando não há jobs', async () => {
      // Act
      const jobs = await queue.getJobs();

      // Assert
      expect(jobs).toHaveLength(0);
    });
  });

  describe('removeJob', () => {
    it('deve remover um job com sucesso', async () => {
      // Arrange
      const data = { key: 'value' };
      const job = await queue.add(data);

      // Act
      const result = await queue.removeJob(job.id);
      const retrievedJob = await queue.getJob(job.id);

      // Assert
      expect(result).toBe(true);
      expect(retrievedJob).toBeUndefined();
    });

    it('deve retornar false ao tentar remover um job inexistente', async () => {
      // Act
      const result = await queue.removeJob('non-existent-id');

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('clear', () => {
    it('deve limpar todos os jobs da fila', async () => {
      // Arrange
      const data1 = { key: 'value1' };
      const data2 = { key: 'value2' };
      await queue.add(data1);
      await queue.add(data2);

      // Act
      await queue.clear();
      const jobs = await queue.getJobs();

      // Assert
      expect(jobs).toHaveLength(0);
    });
  });

  describe('processamento automático', () => {
    it('deve processar jobs automaticamente na ordem de adição', async () => {
      // Arrange
      const processedJobs = [];
      processor.mockImplementation(job => {
        processedJobs.push(job.data);
        return Promise.resolve();
      });

      queue.process(processor);

      // Act
      await queue.add({ order: 1 });
      await queue.add({ order: 2 });
      await queue.add({ order: 3 });

      // Aguarda o processamento automático
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Assert
      expect(processedJobs).toEqual([
        { order: 1 },
        { order: 2 },
        { order: 3 },
      ]);
    });

    it('deve respeitar o delay dos jobs', async () => {
      // Arrange
      const processedJobs = [];
      processor.mockImplementation(job => {
        processedJobs.push(job.data);
        return Promise.resolve();
      });

      queue.process(processor);

      // Act
      await queue.add({ order: 1 });
      await queue.add({ order: 2 }, { delay: 2000 });
      await queue.add({ order: 3 });

      // Aguarda o primeiro processamento
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Assert - Apenas os jobs sem delay devem ter sido processados
      expect(processedJobs).toEqual([
        { order: 1 },
        { order: 3 },
      ]);

      // Aguarda mais tempo para o job com delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Assert - Agora todos os jobs devem ter sido processados
      expect(processedJobs).toEqual([
        { order: 1 },
        { order: 3 },
        { order: 2 },
      ]);
    });
  });
}); 