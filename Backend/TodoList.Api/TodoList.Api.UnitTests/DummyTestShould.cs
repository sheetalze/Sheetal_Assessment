using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using TodoList.Api.Controllers;
using TodoList.Api.Models;
using Xunit;

namespace TodoList.Api.UnitTests
{
    public class TodoItemsControllerTests
    {
        [Fact]
        public async Task GetTodoItems_ReturnsOkResult()
        {
            // Arrange
            var mockLogger = new Mock<ILogger<TodoItemsController>>();
            var mockContext = new Mock<TodoContext>();
            mockContext.Setup(repo => repo.TodoItems)
                       .Returns(GetTestTodoItems());
            var controller = new TodoItemsController(mockContext.Object, mockLogger.Object);

            // Act
            var result = await controller.GetTodoItems();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var items = Assert.IsAssignableFrom<IEnumerable<TodoItem>>(okResult.Value);
            Assert.Equal(2, items.Count());
        }

        [Fact]
        public async Task GetTodoItem_ReturnsOkResult()
        {
            // Arrange
            var itemId = Guid.NewGuid();
            var mockLogger = new Mock<ILogger<TodoItemsController>>();
            var mockContext = new Mock<TodoContext>();
            mockContext.Setup(repo => repo.TodoItems)
                       .Returns(GetTestTodoItems());
            var controller = new TodoItemsController(mockContext.Object, mockLogger.Object);

            // Act
            var result = await controller.GetTodoItem(itemId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var item = Assert.IsType<TodoItem>(okResult.Value);
            Assert.Equal(itemId, item.Id);
        }

        private IQueryable<TodoItem> GetTestTodoItems()
        {
            var todoItems = new List<TodoItem>
            {
                new TodoItem { Id = Guid.NewGuid(), Description = "Item 1", IsCompleted = false },
                new TodoItem { Id = Guid.NewGuid(), Description = "Item 2", IsCompleted = false }
            };
            return todoItems.AsQueryable();
        }
    }
}
