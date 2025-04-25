const TodoList = ({ visible, onClose, tasks, setTasks }) => {
    const [newTask, setNewTask] = useState('');
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTaskText, setEditTaskText] = useState('');
  
    const addTask = () => {
      if (!newTask.trim()) {
        alert('Пожалуйста, введите задачу');
        return;
      }
      const newTaskObj = {
        id: Date.now(), // Уникальный ID на основе времени
        text: newTask.trim(),
        completed: false,
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask('');
    };
  
    const deleteTask = (id) => {
      setTasks(tasks.filter((task) => task.id !== id));
    };
  
    const toggleTaskCompletion = (id) => {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    };
  
    const startEditing = (task) => {
      setEditTaskId(task.id);
      setEditTaskText(task.text);
    };
  
    const saveEdit = (id) => {
      if (!editTaskText.trim()) {
        alert('Пожалуйста, введите текст задачи');
        return;
      }
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, text: editTaskText.trim() } : task
        )
      );
      setEditTaskId(null);
      setEditTaskText('');
    };
  
    const cancelEdit = () => {
      setEditTaskId(null);
      setEditTaskText('');
    };
  
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <Animatable.View style={styles.todoModalContainer} animation="zoomIn" duration={300}>
            <View style={styles.todoModalHeader}>
              <Text style={styles.todoModalTitle}>Список задач</Text>
              <TouchableOpacity onPress={onClose}>
                <Icon name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
  
            {/* Поле для добавления новой задачи */}
            <View style={styles.todoInputContainer}>
              <TextInput
                style={styles.todoInput}
                placeholder="Добавить задачу (например, Купить кольца)"
                value={newTask}
                onChangeText={setNewTask}
                placeholderTextColor={COLORS.textSecondary}
              />
              <TouchableOpacity style={styles.addTaskButton} onPress={addTask}>
                <Icon name="add" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
  
            {/* Список задач */}
            <FlatList
              data={tasks}
              renderItem={({ item }) => (
                <View style={styles.taskItem}>
                  {editTaskId === item.id ? (
                    <View style={styles.editTaskContainer}>
                      <TextInput
                        style={styles.editTaskInput}
                        value={editTaskText}
                        onChangeText={setEditTaskText}
                      />
                      <TouchableOpacity onPress={() => saveEdit(item.id)}>
                        <Icon name="check" size={20} color={COLORS.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={cancelEdit}>
                        <Icon name="close" size={20} color={COLORS.error} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={styles.checkbox}
                        onPress={() => toggleTaskCompletion(item.id)}
                      >
                        <Icon
                          name={item.completed ? 'check-box' : 'check-box-outline-blank'}
                          size={20}
                          color={item.completed ? COLORS.primary : COLORS.textSecondary}
                        />
                      </TouchableOpacity>
                      <Text
                        style={[
                          styles.taskText,
                          item.completed && styles.taskTextCompleted,
                        ]}
                      >
                        {item.text}
                      </Text>
                      <View style={styles.taskActions}>
                        <TouchableOpacity onPress={() => startEditing(item)}>
                          <Icon name="edit" size={20} color={COLORS.secondary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteTask(item.id)}>
                          <Icon name="delete" size={20} color={COLORS.error} />
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={
                <Text style={styles.emptyTaskText}>Нет задач для отображения</Text>
              }
              contentContainerStyle={styles.taskList}
            />
          </Animatable.View>
        </View>
      </Modal>
    );
  };