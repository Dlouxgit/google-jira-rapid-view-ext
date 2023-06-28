// 在代码的顶部定义一个变量用于存储已点击的 columnId
let clickedColumnIds = [];

// content.js
const observer = new MutationObserver(function (mutationsList) {
  for (let mutation of mutationsList) {
    if (
      mutation.target.classList.contains("ghx-throbber") &&
      mutation.addedNodes.length === 0
    ) {
      // 获取页面中所有 .ghx-issue-content 元素
      const issueContents = document.querySelectorAll(
        ".js-detailview.ghx-issue"
      );

      // 遍历每个 .ghx-issue-content 元素
      issueContents.forEach((issueContent) => {
        // 获取当前 .ghx-issue-content 元素内的 .ghx-key 元素
        const keyElement = issueContent.querySelector(".ghx-key");

        // 如果找到了 .ghx-key 元素
        if (keyElement) {
          // 获取 .ghx-key 元素的文本
          const keyText = `<span class="copy" style="cursor: pointer;">${keyElement.textContent.trim()}</span>`;

          // 获取当前 .ghx-issue-content 元素下的 .ghx-avatar 元素
          const avatarElement = issueContent.querySelector(".ghx-avatar-img");
          const innerElement = issueContent.querySelector(".ghx-inner");

          let innerText = "";
          if (innerElement) {
            innerText = `
                <br />
                - <span class="copy" style="cursor: pointer;">${innerElement.textContent.trim()}</span>`;
          }

          let innerHTML = keyText + innerText;

          // 如果找到了 .ghx-avatar 元素
          if (avatarElement) {
            // 获取 .ghx-avatar 元素的 alt 属性值
            const altText = avatarElement.getAttribute("alt");

            // 将 .ghx-key 元素和 .ghx-avatar 的 alt 属性值合并为新的文本
            innerHTML += `<br />
              - ${altText}`;

            // 将 .ghx-issue-content 元素的 innerHTML 替换为新的文本
          }
          issueContent.innerHTML = innerHTML;
        }

        const copyElements = issueContent.querySelectorAll(".copy");
        // 为每个 .copy 元素添加点击复制文本功能
        copyElements.forEach((copyElement) => {
          copyElement.addEventListener("click", () => {
            // 创建一个隐藏的文本输入框
            const input = document.createElement("input");
            input.style.position = "fixed";
            input.style.top = "-9999px";

            // 设置要复制的文本为输入框的值
            input.value = copyElement.textContent;

            // 将文本输入框附加到页面中
            document.body.appendChild(input);

            // 选中文本
            input.select();

            // 复制文本
            document.execCommand("copy");

            // 删除文本输入框和复制成功的提示
            document.body.removeChild(input);
            console.log("文本已复制：", copyElement.textContent);
          });
        });
      });

      // 获取页面中所有 .ghx-column 元素
      const columns = document.querySelectorAll(".ghx-column-headers .ghx-column");

      // 遍历每个 .ghx-column 元素
      columns.forEach((column) => {
        // 获取当前 .ghx-column 元素的 data-id 属性值
        const columnId = column.dataset.id;

        // 创建删除按钮元素
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "删除列";

        // 监听删除按钮的点击事件
        deleteButton.addEventListener("click", () => {
          // 添加已点击的 columnId 到数组中
          clickedColumnIds.push(columnId);

          // 获取所有具有相同 data-column-id 值的 .ghx-column 元素
          const columnsToDelete = [
            ...document.querySelectorAll(`.ghx-column[data-id="${columnId}"]`),
            ...document.querySelectorAll(
              `.ghx-column[data-column-id="${columnId}"]`
            ),
          ];

          // 遍历要删除的 .ghx-column 元素并将其从 DOM 中移除
          columnsToDelete.forEach((columnToDelete) => {
            columnToDelete.remove();
          });
        });

        // 将删除按钮元素添加到当前 .ghx-column 元素中
        column.appendChild(deleteButton);
      });

        // 删除已点击的 columnId 对应的元素
        clickedColumnIds.forEach((clickedColumnId) => {
            const elementsToDelete = [
                ...document.querySelectorAll(`.ghx-column[data-id="${clickedColumnId}"]`),
                ...document.querySelectorAll(`.ghx-column[data-column-id="${clickedColumnId}"]`),
            ];

            elementsToDelete.forEach((element) => {
                element.remove();
            });
        });

        
    }
  }
});

const observerOptions = {
  childList: true,
  subtree: false,
};

observer.observe(document.querySelector(".ghx-throbber"), observerOptions);

setTimeout(() => {

    // 创建还原列按钮元素
    const restoreButton = document.createElement("button");
    restoreButton.textContent = "还原列";

    // 监听还原按钮的点击事件
    restoreButton.addEventListener("click", () => {
    // 清空已点击的 columnId 数组
    clickedColumnIds = [];
    });

    // 找到 #ghx-controls-work 元素
    const columnHeadersElement = document.querySelector("#ghx-controls-work");

    // 找到 #ghx-column-headers 的第一个子元素
    const firstChildElement = columnHeadersElement.firstChild;

    // 将还原按钮元素插入到第一个子元素之前
    columnHeadersElement.insertBefore(restoreButton, firstChildElement);
}, 300)