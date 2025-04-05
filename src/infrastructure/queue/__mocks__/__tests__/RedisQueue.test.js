const RedisQueue = require('../RedisQueue');

describe('RedisQueue Mock', () => {
  let queue;
  let processor;

  beforeEach(() => {
    queue = RedisQueue();
    processor = jest.fn();
  });

  it('deve adicionar um job à fila', async () => {
    // Arrange
    const data = { key: 'value' };
    const opts = { delay: 1000 };

    // Act
    const job = await queue.add(data, opts);

    // Assert
    expect(job).toHaveProperty('id');
    expect(job.data).toEqual(data);
    expect(job.opts).toEqual(opts);
    expect(job.timestamp).toBeDefined();
  });

  it('deve registrar um processador', () => {
    // Act
    queue.process(processor);

    // Assert
    expect(queue.process).toHaveBeenCalledWith(processor);
  });

  it('deve obter um job pelo ID', async () => {
    // Arrange
    const data = { key: 'value' };
    const job = await queue.add(data);

    // Act
    const retrievedJob = await queue.getJob(job.id);

    // Assert
    expect(retrievedJob).toEqual(job);
  });

  it('deve obter todos os jobs', async () => {
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

  it('deve remover um job pelo ID', async () => {
    // Arrange
    const data = { key: 'value' };
    const job = await queue.add(data);

    // Act
    const result = await queue.removeJob(job.id);

    // Assert
    expect(result).toBe(true);
    const retrievedJob = await queue.getJob(job.id);
    expect(retrievedJob).toBeUndefined();
  });

  it('deve limpar todos os jobs', async () => {
    // Arrange
    const data1 = { key: 'value1' };
    const data2 = { key: 'value2' };
    await queue.add(data1);
    await queue.add(data2);

    // Act
    await queue.clear();

    // Assert
    const jobs = await queue.getJobs();
    expect(jobs).toHaveLength(0);
  });

  it('deve processar jobs automaticamente', async () => {
    // Arrange
    const data = { key: 'value' };
    await queue.add(data);
    queue.process(processor);

    // Act
    // Aguarda o processamento automático (que ocorre a cada 1 segundo)
    await new Promise(resolve => setTimeout(resolve, 1100));

    // Assert
    expect(processor).toHaveBeenCalled();
  });

  it('deve marcar jobs como processados após o processamento bem-sucedido', async () => {
    // Arrange
    const data = { key: 'value' };
    const job = await queue.add(data);
    processor.mockResolvedValue(true);
    queue.process(processor);

    // Act
    // Aguarda o processamento automático
    await new Promise(resolve => setTimeout(resolve, 1100));

    // Assert
    expect(job.processed).toBe(true);
    expect(job.status).toBe('completed');
  });

  it('deve marcar jobs como falhos após o processamento com erro', async () => {
    // Arrange
    const data = { key: 'value' };
    const job = await queue.add(data);
    const error = new Error('Test error');
    processor.mockRejectedValue(error);
    queue.process(processor);

    // Act
    // Aguarda o processamento automático
    await new Promise(resolve => setTimeout(resolve, 1100));

    // Assert
    expect(job.status).toBe('failed');
    expect(job.error).toBe(error.message);
  });
}); 