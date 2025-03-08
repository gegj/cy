// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initPage();
    
    // 添加复制按钮功能
    initCopyButtons();
    
    // 添加分享功能
    initShareButtons();
    
    // 添加提现按钮功能
    initWithdrawButtons();
    
    // 添加动画效果
    addAnimations();
    
    // 更新日期为当天日期
    updateCurrentDates();
    
    // 初始化设置菜单内容
    initSettingsContent();
    
    // 如果在管理页面，初始化输入框的值
    const totalInvitesInput = document.getElementById('totalInvites');
    if (totalInvitesInput) {
        // 设置总邀请数为8680
        localStorage.setItem('totalInvites', '8680');
        totalInvitesInput.value = '8680';
    }
    
    const todayInvitesInput = document.getElementById('todayInvites');
    if (todayInvitesInput) {
        // 设置今日新增为0
        localStorage.setItem('todayInvites', '0');
        todayInvitesInput.value = '0';
    }
    
    const unitPriceInput = document.getElementById('unitPrice');
    if (unitPriceInput) {
        // 设置单价为0.90
        localStorage.setItem('unitPrice', '0.90');
        unitPriceInput.value = '0.90';
    }
    
    const inviteCodeInput = document.getElementById('inviteCode');
    if (inviteCodeInput) {
        inviteCodeInput.value = localStorage.getItem('inviteCode') || 'SHARE123';
    }
    
    const newUsersLimitInput = document.getElementById('newUsersLimit');
    if (newUsersLimitInput) {
        // 设置新增用户显示数量为6
        localStorage.setItem('newUsersLimit', '6');
        newUsersLimitInput.value = '6';
    }
    
    // 设置增长规则
    const defaultRules = [
        { minValue: 0, maxValue: 0, probability: 60 },
        { minValue: 0, maxValue: 3, probability: 35 },
        { minValue: 0, maxValue: 5, probability: 5 }
    ];
    localStorage.setItem('growthRules', JSON.stringify(defaultRules));
    
    // 更新页面上的总邀请数显示
    updateTotalInvitesDisplay();
    // 更新页面上的今日新增显示
    updateTodayInvitesDisplay();
    // 更新页面上的收益显示
    updateEarningsDisplay();
    // 更新页面上的邀请码显示
    updateInviteCodeDisplay();
    // 更新页面上的单价显示
    updateUnitPriceDisplay();
    // 更新页面上的余额显示
    updateBalanceDisplay();
    
    // 初始化下拉刷新
    initPullToRefresh();
    
    // 添加调试信息
    console.log('页面加载完成，已更新所有显示');
});

/**
 * 初始化页面
 */
function initPage() {
    // 移除页面加载动画
    // const mainContent = document.querySelector('main');
    // if (mainContent) {
    //     mainContent.classList.add('animate-fadeIn');
    // }
    
    // 更新增长规则为新的设置
    const newGrowthRules = [
        { value: 0, probability: 50 },
        { value: 1, probability: 30 },
        { value: 2, probability: 15 },
        { value: 3, probability: 5 }
    ];
    localStorage.setItem('growthRules', JSON.stringify(newGrowthRules));
    
    // 检测当前页面并高亮对应的底部导航
    highlightCurrentNav();
    
    // 获取当前页面的路径
    const currentPath = window.location.pathname;
    
    // 初始化页面特定功能
    if (currentPath.includes('invite.html')) {
        // 邀请页面 - 初始化新增用户列表
        updateNewUsersList();
    } else if (currentPath.includes('profile.html')) {
        // 个人页面 - 初始化收益明细和提现记录
        initProfileRecords();
        // 更新个人资料显示
        updateProfileDisplay();
    } else if (currentPath.includes('admin.html')) {
        // 管理员页面 - 初始化活动图片输入框
        initBannerInput();
    } else if (currentPath.endsWith('/') || currentPath.endsWith('index.html')) {
        // 首页 - 初始化活动图片
        initBanner();
    }
    
    // 检查是否需要打开提现窗口（从首页跳转过来）
    if (sessionStorage.getItem('openWithdraw') === 'true') {
        // 清除标记，避免刷新页面时再次触发
        sessionStorage.removeItem('openWithdraw');
        
        // 延迟一点时间再触发，确保页面已完全加载
        setTimeout(() => {
            // 检查是否在"我的"页面
            if (window.location.pathname.includes('profile.html')) {
                // 触发立即提现按钮
                const withdrawButton = document.querySelector('.bg-blue-600.text-white.px-4.py-2.rounded-lg');
                if (withdrawButton) {
                    withdrawButton.click();
                }
            }
        }, 300);
    }
    
    // 添加自定义样式
    const style = document.createElement('style');
    style.textContent = `
        .custom-input {
            width: 100%;
            padding: 0.5rem 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 0.375rem;
            outline: none;
        }
        .custom-input:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        @keyframes highlight {
            0% { background-color: rgba(59, 130, 246, 0.2); }
            100% { background-color: transparent; }
        }
        
        @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(-10px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes rewardPulse {
            0% { transform: scale(1); color: #059669; }
            50% { transform: scale(1.2); color: #10B981; }
            100% { transform: scale(1); color: #059669; }
        }
        
        .animate-new-item {
            animation: fadeIn 0.8s ease-out, pulse 1.5s ease-in-out 0.8s 2;
        }
        
        .reward-highlight {
            animation: rewardPulse 1s ease-in-out infinite;
            font-weight: bold;
            text-shadow: 0 0 5px rgba(16, 185, 129, 0.3);
        }
        
        .toast-success {
            background-color: #10B981;
            animation: pulse 2s infinite;
        }
    `;
    document.head.appendChild(style);
}

/**
 * 高亮当前页面的底部导航
 */
function highlightCurrentNav() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('footer a');
    
    // 首先将所有导航项重置为非高亮状态
    navLinks.forEach(link => {
        link.classList.remove('text-blue-600');
        link.classList.add('text-gray-500');
    });
    
    // 然后只高亮当前页面对应的导航项
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        // 处理首页的情况
        if ((currentPath.endsWith('/index.html') || currentPath.endsWith('/')) && 
            (linkPath === '../index.html' || linkPath === 'index.html')) {
            link.classList.add('text-blue-600');
            link.classList.remove('text-gray-500');
        }
        // 处理其他页面的情况
        else if (linkPath && currentPath.includes(linkPath) && 
                !linkPath.includes('index.html')) {
            link.classList.add('text-blue-600');
            link.classList.remove('text-gray-500');
        }
    });
    
    console.log('当前路径:', currentPath, '已高亮对应的导航项');
}

/**
 * 初始化复制按钮
 */
function initCopyButtons() {
    // 查找所有包含"复制"文本的按钮
    const copyButtons = document.querySelectorAll('button');
    
    copyButtons.forEach(button => {
        if (button.textContent.includes('复制')) {
            button.addEventListener('click', function() {
                // 获取要复制的文本
                let textToCopy = '';
                
                // 邀请码复制按钮
                if (this.closest('.bg-white\\/20') || this.closest('.bg-white')) {
                    const codeElement = this.closest('div').querySelector('p.text-xl.font-bold');
                    if (codeElement) {
                        textToCopy = codeElement.textContent.trim();
                    }
                }
                
                if (!textToCopy) return;
                
                // 复制到剪贴板
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        // 显示成功提示
                        showToast('邀请码复制成功！', 2000, 'success');
                        
                        // 临时改变按钮文字
                        const originalText = this.textContent;
                        this.textContent = '已复制';
                        
                        // 2秒后恢复原文字
                        setTimeout(() => {
                            this.textContent = originalText;
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('复制失败:', err);
                        showToast('复制失败，请手动复制', 2000, 'error');
                    });
            });
        }
    });
}

/**
 * 初始化分享功能
 */
function initShareButtons() {
    // 分享链接按钮
    const shareButtons = document.querySelectorAll('button:contains("分享链接")');
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const inviteCode = localStorage.getItem('inviteCode') || 'SHARE123';
            // 构建分享链接
            const shareUrl = `${window.location.origin}/index.html?invite=${inviteCode}`;
            
            // 复制到剪贴板
            navigator.clipboard.writeText(shareUrl)
                .then(() => {
                    showToast('链接复制成功！');
                })
                .catch(err => {
                    console.error('复制失败:', err);
                    showToast('复制失败，请重试');
                });
        });
    });
    
    // 海报生成按钮
    const posterButtons = document.querySelectorAll('button:contains("生成海报")');
    posterButtons.forEach(button => {
        button.addEventListener('click', function() {
            showToast('海报生成功能即将上线');
        });
    });
}

/**
 * 初始化提现按钮功能
 */
function initWithdrawButtons() {
    const withdrawButtons = document.querySelectorAll('button:contains("提现")');
    
    withdrawButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 这里可以添加提现逻辑或弹窗
            showWithdrawModal();
        });
    });
}

/**
 * 添加动画效果
 */
function addAnimations() {
    // 为卡片添加悬停效果
    const cards = document.querySelectorAll('.bg-white.rounded-lg');
    cards.forEach(card => {
        card.classList.add('card-hover');
    });
    
    // 为按钮添加波纹效果
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.classList.add('ripple');
    });
    
    // 添加淡入淡出动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes rewardPulse {
            0% { transform: scale(1); color: #059669; }
            50% { transform: scale(1.2); color: #10B981; }
            100% { transform: scale(1); color: #059669; }
        }
        
        .toast {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
        }
        
        .animate-pulse {
            animation: pulse 2s infinite;
        }
        
        .reward-highlight {
            animation: rewardPulse 1s ease-in-out infinite;
            font-weight: bold;
            text-shadow: 0 0 5px rgba(16, 185, 129, 0.3);
        }
    `;
    document.head.appendChild(style);
}

/**
 * 显示提示消息
 * @param {string} message - 要显示的消息
 * @param {number} duration - 显示时长（毫秒）
 */
function showToast(message, duration = 2000, type = 'info') {
    // 检查是否已存在toast
    let toast = document.querySelector('.toast');
    
    // 根据类型设置不同的样式
    let bgColor, textColor, icon;
    
    switch(type) {
        case 'success':
            bgColor = 'bg-gradient-to-r from-green-500 to-green-600';
            textColor = 'text-white';
            icon = '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
            break;
        case 'warning':
            bgColor = 'bg-gradient-to-r from-yellow-400 to-yellow-500';
            textColor = 'text-gray-800';
            icon = '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
            break;
        case 'error':
            bgColor = 'bg-gradient-to-r from-red-500 to-red-600';
            textColor = 'text-white';
            icon = '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
            break;
        case 'refresh':
            bgColor = 'bg-gradient-to-r from-blue-400 to-blue-500';
            textColor = 'text-white';
            icon = '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>';
            break;
        default: // info
            bgColor = 'bg-gradient-to-r from-blue-500 to-blue-600';
            textColor = 'text-white';
            icon = '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
    }
    
    if (!toast) {
        // 创建toast元素
        toast = document.createElement('div');
        document.body.appendChild(toast);
    }
    
    // 将换行符转换为 <br> 标签
    const formattedMessage = message.replace(/\n/g, '<br>');
    
    // 设置样式和内容
    toast.className = `toast fixed top-16 left-1/2 transform -translate-x-1/2 ${bgColor} ${textColor} px-4 py-3 rounded-lg shadow-lg z-50 flex items-center justify-center min-w-[200px] max-w-[80%] text-center`;
    toast.innerHTML = `
        ${icon}
        <span class="font-medium whitespace-pre-line">${formattedMessage}</span>
    `;
    
    // 显示toast
    toast.style.display = 'flex';
    
    // 设定时间后隐藏
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.style.display = 'none';
            toast.style.opacity = '1';
        }, 300);
    }, duration);
}

/**
 * 显示模态框
 * @param {string} title - 模态框标题
 * @param {string} content - 模态框内容HTML
 */
function showModal(title, content) {
    // 检查是否已存在modal
    let modal = document.querySelector('.modal-container');
    
    if (!modal) {
        // 创建modal容器
        modal = document.createElement('div');
        modal.className = 'modal-container fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        
        // 创建modal内容
        const modalContent = `
            <div class="modal-content bg-white rounded-lg shadow-xl w-11/12 max-w-md overflow-hidden">
                <div class="modal-header border-b border-gray-200 px-4 py-3 flex justify-between items-center">
                    <h3 class="font-semibold text-lg modal-title">${title}</h3>
                    <button class="modal-close text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="modal-body">${content}</div>
            </div>
        `;
        
        modal.innerHTML = modalContent;
        document.body.appendChild(modal);
        
        // 添加关闭事件
        modal.querySelector('.modal-close').addEventListener('click', () => {
            closeModal();
        });
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    } else {
        // 更新已存在的modal
        modal.querySelector('.modal-title').textContent = title;
        modal.querySelector('.modal-body').innerHTML = content;
        modal.style.display = 'flex';
    }
    
    // 防止滚动
    document.body.style.overflow = 'hidden';
}

/**
 * 关闭模态框
 */
function closeModal() {
    const modal = document.querySelector('.modal-container');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            modal.style.opacity = '1';
            document.body.style.overflow = '';
        }, 300);
    }
}

// 扩展方法：为NodeList添加contains方法
NodeList.prototype.forEach = Array.prototype.forEach;
HTMLCollection.prototype.forEach = Array.prototype.forEach;

// 扩展选择器方法
Element.prototype.contains = function(text) {
    return this.textContent.includes(text);
};

// 为NodeList添加:contains选择器功能
NodeList.prototype.filter = Array.prototype.filter;
HTMLCollection.prototype.filter = Array.prototype.filter;

// 扩展querySelector方法以支持:contains选择器
const originalQuerySelectorAll = Document.prototype.querySelectorAll;
Document.prototype.querySelectorAll = function(selector) {
    if (selector.includes(':contains(')) {
        const match = selector.match(/(.*):contains\("(.*)"\)(.*)/);
        if (match) {
            const [_, before, text, after] = match;
            const elements = originalQuerySelectorAll.call(this, before + after);
            return Array.from(elements).filter(el => el.textContent.includes(text));
        }
    }
    return originalQuerySelectorAll.call(this, selector);
};

/**
 * 更新带有current-date类的元素，显示当天日期
 */
function updateCurrentDates() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    const dateElements = document.querySelectorAll('.current-date');
    dateElements.forEach(element => {
        element.textContent = formattedDate;
    });
}

/**
 * 初始化设置菜单内容
 */
function initSettingsContent() {
    // 初始化总邀请数输入框
    const totalInvitesInput = document.getElementById('totalInvites');
    if (totalInvitesInput) {
        totalInvitesInput.value = localStorage.getItem('totalInvites') || '0';
    }
    
    // 初始化今日新增输入框
    const todayInvitesInput = document.getElementById('todayInvites');
    if (todayInvitesInput) {
        todayInvitesInput.value = localStorage.getItem('todayInvites') || '0';
    }
    
    // 初始化单价输入框
    const unitPriceInput = document.getElementById('unitPrice');
    if (unitPriceInput) {
        unitPriceInput.value = localStorage.getItem('unitPrice') || '0.90';
    }
    
    // 初始化邀请码输入框
    const inviteCodeInput = document.getElementById('inviteCode');
    if (inviteCodeInput) {
        inviteCodeInput.value = localStorage.getItem('inviteCode') || 'SHARE123';
    }
    
    // 初始化新增用户显示数量输入框
    const newUsersLimitInput = document.getElementById('newUsersLimit');
    if (newUsersLimitInput) {
        newUsersLimitInput.value = localStorage.getItem('newUsersLimit') || '15';
    }
    
    // 初始化增长规则
    initGrowthRules();
    
    // 定义个人资料设置内容
    window.profileSettingsContent = `
        <div class="p-4">
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">头像</label>
                <div class="flex items-center mb-2">
                    <div class="w-16 h-16 bg-gray-200 rounded-full overflow-hidden mr-4">
                        <img src="${localStorage.getItem('avatarUrl') || 'https://dthezntil550i.cloudfront.net/p4/latest/p42102052243097410008650553/1280_960/12bc8bc0-2186-48fb-b432-6c011a559ec0.png'}" alt="用户头像" class="w-full h-full object-cover" id="profileAvatarPreview">
                    </div>
                </div>
                <div class="mb-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">头像URL</label>
                    <input type="text" id="profileAvatarUrl" class="custom-input" value="${localStorage.getItem('avatarUrl') || 'https://dthezntil550i.cloudfront.net/p4/latest/p42102052243097410008650553/1280_960/12bc8bc0-2186-48fb-b432-6c011a559ec0.png'}" placeholder="请输入头像图片URL">
                    <p class="text-xs text-gray-500 mt-1">输入图片URL后，点击下方预览按钮查看效果</p>
                </div>
                <button class="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm mr-2" onclick="previewAvatar()">预览头像</button>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">昵称</label>
                <input type="text" id="profileNickname" class="custom-input" value="${localStorage.getItem('nickname') || '张小明'}" placeholder="请输入昵称">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">会员等级</label>
                <input type="text" id="profileMemberLevel" class="custom-input" value="${localStorage.getItem('memberLevel') || '代理用户（有管道）'}" placeholder="请输入会员等级">
                <p class="text-xs text-gray-500 mt-1">自定义您的会员等级显示</p>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
                <div class="flex">
                    <input type="text" class="custom-input" value="138****1234" disabled>
                    <button class="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm ml-2">修改</button>
                </div>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">性别</label>
                <div class="flex space-x-4">
                    <label class="inline-flex items-center">
                        <input type="radio" name="gender" class="form-radio" ${localStorage.getItem('gender') !== '女' ? 'checked' : ''}>
                        <span class="ml-2">男</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input type="radio" name="gender" class="form-radio" ${localStorage.getItem('gender') === '女' ? 'checked' : ''}>
                        <span class="ml-2">女</span>
                    </label>
                </div>
            </div>
            <div class="flex justify-end">
                <button class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm mr-2" onclick="closeModal()">取消</button>
                <button class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm" onclick="saveProfile()">保存</button>
            </div>
        </div>
    `;
    
    // 定义账号安全设置内容
    window.securitySettingsContent = `
        <div class="p-4">
            <div class="border-b border-gray-100 pb-4 mb-4">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="font-medium">登录密码</h3>
                        <p class="text-xs text-gray-500 mt-1">定期修改密码可以保护账号安全</p>
                    </div>
                    <button class="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm">修改</button>
                </div>
            </div>
            <div class="border-b border-gray-100 pb-4 mb-4">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="font-medium">支付密码</h3>
                        <p class="text-xs text-gray-500 mt-1">用于提现和支付等操作，请妥善保管</p>
                    </div>
                    <button class="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm">设置</button>
                </div>
            </div>
            <div class="border-b border-gray-100 pb-4 mb-4">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="font-medium">实名认证</h3>
                        <p class="text-xs text-gray-500 mt-1">完成实名认证，享受更多权益</p>
                    </div>
                    <button class="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">去认证</button>
                </div>
            </div>
            <div>
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="font-medium">账号注销</h3>
                        <p class="text-xs text-gray-500 mt-1">注销后账号数据将无法恢复</p>
                    </div>
                    <button class="bg-red-600 text-white px-3 py-1 rounded-lg text-sm">申请注销</button>
                </div>
            </div>
        </div>
    `;
    
    // 定义消息通知设置内容
    window.notificationSettingsContent = `
        <div class="p-4">
            <div class="border-b border-gray-100 pb-4 mb-4">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="font-medium">系统通知</h3>
                        <p class="text-xs text-gray-500 mt-1">接收系统更新、维护等通知</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" checked>
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>
            <div class="border-b border-gray-100 pb-4 mb-4">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="font-medium">活动通知</h3>
                        <p class="text-xs text-gray-500 mt-1">接收优惠活动、新功能等通知</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" checked>
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>
            <div class="border-b border-gray-100 pb-4 mb-4">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="font-medium">邀请通知</h3>
                        <p class="text-xs text-gray-500 mt-1">接收好友邀请成功等通知</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" checked>
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>
            <div>
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="font-medium">交易通知</h3>
                        <p class="text-xs text-gray-500 mt-1">接收提现、收益等交易通知</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" checked>
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>
        </div>
    `;
    
    // 添加开关样式
    const style = document.createElement('style');
    style.textContent = `
        .switch {
            position: relative;
            display: inline-block;
            width: 44px;
            height: 24px;
        }
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
        }
        input:checked + .slider {
            background-color: #3b82f6;
        }
        input:checked + .slider:before {
            transform: translateX(20px);
        }
        .slider.round {
            border-radius: 24px;
        }
        .slider.round:before {
            border-radius: 50%;
        }
    `;
    document.head.appendChild(style);
}

/**
 * 初始化增长规则
 */
function initGrowthRules() {
    const rulesContainer = document.getElementById('growthRulesContainer');
    if (!rulesContainer) return;
    
    // 清空容器
    rulesContainer.innerHTML = '';
    
    // 获取保存的规则
    let growthRules = getGrowthRules();
    
    // 如果没有规则，添加默认规则
    if (growthRules.length === 0) {
        growthRules = [
            { value: 0, probability: 50 },
            { value: 1, probability: 30 },
            { value: 2, probability: 15 },
            { value: 3, probability: 5 }
        ];
        // 保存默认规则
        localStorage.setItem('growthRules', JSON.stringify(growthRules));
    }
    
    // 添加规则到界面
    growthRules.forEach((rule, index) => {
        addRuleToUI(rule, index);
    });
}

/**
 * 获取保存的增长规则
 */
function getGrowthRules() {
    try {
        const rulesJson = localStorage.getItem('growthRules');
        console.log('读取增长规则数据:', rulesJson);
        
        if (!rulesJson) {
            console.log('未找到增长规则数据，返回空数组');
            return [];
        }
        
        const rules = JSON.parse(rulesJson);
        
        // 验证规则格式
        if (!Array.isArray(rules)) {
            console.error('增长规则数据不是数组格式');
            return [];
        }
        
        // 过滤无效规则
        const validRules = rules.filter(rule => 
            rule && 
            typeof rule.value !== 'undefined' && 
            typeof rule.probability !== 'undefined'
        );
        
        return validRules;
    } catch (error) {
        console.error('解析增长规则失败:', error);
        return [];
    }
}

/**
 * 添加规则到界面
 */
function addRuleToUI(rule = { value: 0, probability: 50 }, index) {
    const rulesContainer = document.getElementById('growthRulesContainer');
    if (!rulesContainer) return;
    
    const ruleId = `rule-${Date.now()}-${index}`;
    const ruleElement = document.createElement('div');
    ruleElement.className = 'bg-gray-50 rounded-lg p-3 relative';
    ruleElement.dataset.ruleId = ruleId;
    
    ruleElement.innerHTML = `
        <button class="absolute top-2 right-2 text-gray-400 hover:text-red-500" onclick="removeGrowthRule('${ruleId}')">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        <div class="grid grid-cols-2 gap-3">
            <div>
                <label class="block text-xs text-gray-500 mb-1">增加人数</label>
                <input type="number" class="rule-value w-full border border-gray-300 rounded-lg px-3 py-1 text-sm" value="${rule.value}" min="0">
            </div>
            <div>
                <label class="block text-xs text-gray-500 mb-1">概率 (%)</label>
                <input type="number" class="rule-probability w-full border border-gray-300 rounded-lg px-3 py-1 text-sm" value="${rule.probability}" min="0" max="100">
            </div>
        </div>
        <div class="mt-2">
            <p class="text-xs text-gray-500">下拉刷新时增加 ${rule.value} 人的概率为 ${rule.probability}%</p>
        </div>
    `;
    
    rulesContainer.appendChild(ruleElement);
}

/**
 * 添加新的增长规则
 */
function addGrowthRule() {
    // 默认规则
    const defaultRule = {
        value: 0,
        probability: 10
    };
    
    // 获取当前规则数量
    const rulesContainer = document.getElementById('growthRulesContainer');
    const ruleCount = rulesContainer ? rulesContainer.children.length : 0;
    
    // 添加规则到界面
    addRuleToUI(defaultRule, ruleCount);
}

/**
 * 移除增长规则
 */
function removeGrowthRule(ruleId) {
    const ruleElement = document.querySelector(`[data-rule-id="${ruleId}"]`);
    if (ruleElement) {
        ruleElement.remove();
    }
}

/**
 * 保存所有增长规则
 */
function saveGrowthRules() {
    const rulesContainer = document.getElementById('growthRulesContainer');
    const rateWarning = document.getElementById('rateWarning');
    
    if (!rulesContainer) return;
    
    // 收集所有规则
    const rules = [];
    let totalProbability = 0;
    
    Array.from(rulesContainer.children).forEach(ruleElement => {
        const valueInput = ruleElement.querySelector('.rule-value');
        const probabilityInput = ruleElement.querySelector('.rule-probability');
        
        if (valueInput && probabilityInput) {
            const value = parseInt(valueInput.value) || 0;
            const probability = parseInt(probabilityInput.value) || 0;
            
            totalProbability += probability;
            
            rules.push({
                value,
                probability
            });
        }
    });
    
    // 验证概率之和是否为100%
    if (totalProbability !== 100) {
        if (rateWarning) rateWarning.classList.remove('hidden');
        showToast('所有概率之和应为100%', 2000, 'warning');
        return;
    }
    
    // 隐藏警告
    if (rateWarning) rateWarning.classList.add('hidden');
    
    // 保存到localStorage
    localStorage.setItem('growthRules', JSON.stringify(rules));
    
    // 测试规则是否生效
    testGrowthRules(rules);
    
    showToast('保存成功', 2000, 'success');
    
    // 在控制台输出调试信息
    console.log('增长规则已保存:', rules);
}

/**
 * 测试增长规则
 */
function testGrowthRules(rules) {
    console.log('测试增长规则:');
    
    // 模拟100次随机数，检查规则分布
    const results = {};
    
    for (let i = 0; i < 100; i++) {
        const random = Math.random() * 100;
        let cumulativeProbability = 0;
        let appliedRule = null;
        
        for (const rule of rules) {
            cumulativeProbability += rule.probability;
            
            if (random < cumulativeProbability) {
                const key = `${rule.value}`;
                results[key] = (results[key] || 0) + 1;
                break;
            }
        }
    }
    
    console.log('规则分布测试结果:', results);
}

/**
 * 保存新增用户显示数量
 */
function saveNewUsersLimit() {
    const newUsersLimitInput = document.getElementById('newUsersLimit');
    if (!newUsersLimitInput) return;
    
    const value = parseInt(newUsersLimitInput.value);
    if (isNaN(value) || value < 1 || value > 50) {
        showToast('请输入1-50之间的有效数字');
        return;
    }
    
    // 保存到 localStorage
    localStorage.setItem('newUsersLimit', value.toString());
    showToast('保存成功');
    
    // 在控制台输出调试信息
    console.log('新增用户显示数量已保存:', value);
}

/**
 * 获取新增用户显示数量
 */
function getNewUsersLimit() {
    const limit = parseInt(localStorage.getItem('newUsersLimit'));
    return isNaN(limit) ? 6 : limit; // 默认为6
}

/**
 * 根据设置的概率增加邀请人数
 * @returns {number} 增加的邀请人数
 */
function increaseInviteCounts() {
    // 获取当前邀请数
    let totalInvites = parseInt(localStorage.getItem('totalInvites') || '0');
    let todayInvites = parseInt(localStorage.getItem('todayInvites') || '0');
    
    // 获取增长规则
    let growthRules = getGrowthRules();
    
    // 如果没有规则，使用默认规则
    if (!growthRules || growthRules.length === 0) {
        growthRules = [
            { value: 0, probability: 50 },
            { value: 1, probability: 30 },
            { value: 2, probability: 15 },
            { value: 3, probability: 5 }
        ];
        localStorage.setItem('growthRules', JSON.stringify(growthRules));
    }
    
    // 生成随机数决定增长范围 (0-100)
    const random = Math.random() * 100;
    let increaseAmount = 0; // 默认为0，确保始终有值
    let cumulativeProbability = 0;
    let appliedRule = null;
    
    console.log('随机数:', random);
    console.log('可用规则:', growthRules);
    
    // 根据概率选择规则
    for (const rule of growthRules) {
        if (!rule || typeof rule.probability === 'undefined') continue; // 跳过无效规则
        
        const prevProbability = cumulativeProbability;
        cumulativeProbability += rule.probability;
        
        console.log(`规则 ${rule.value}: 概率范围 ${prevProbability}-${cumulativeProbability}`);
        
        if (random < cumulativeProbability) {
            // 直接使用规则中的固定值
            increaseAmount = rule.value || 0; // 确保有值，即使rule.value为undefined
            appliedRule = rule;
            console.log(`命中规则: ${rule.value}, 概率: ${rule.probability}%, 增加: ${increaseAmount}人`);
            break;
        }
    }
    
    // 更新邀请数
    totalInvites += increaseAmount;
    todayInvites += increaseAmount;
    
    // 保存到localStorage
    localStorage.setItem('totalInvites', totalInvites.toString());
    localStorage.setItem('todayInvites', todayInvites.toString());
    
    // 保存本次增加的用户数量，用于updateNewUsersList函数中的高亮显示
    localStorage.setItem('lastIncreaseAmount', increaseAmount.toString());
    // 记录更新时间
    localStorage.setItem('lastUpdateTime', Date.now().toString());
    sessionStorage.setItem('lastUpdateTime', Date.now().toString());
    
    // 如果有新增用户，生成新用户数据
    if (increaseAmount > 0) {
        // 获取单价
        const unitPriceStr = localStorage.getItem('unitPrice') || '0.90';
        const unitPrice = parseFloat(unitPriceStr);
        console.log('当前单价:', unitPrice);
        
        // 获取现有新增用户列表
        let newUsers = getNewUsers();
        if (!newUsers) newUsers = []; // 确保newUsers是数组
        
        // 生成新用户数据并添加到列表
        for (let i = 0; i < increaseAmount; i++) {
            const newUser = generateNewUser(unitPrice);
            newUsers.unshift(newUser); // 添加到列表开头
        }
        
        // 获取新增用户显示数量限制
        const limit = getNewUsersLimit();
        
        // 限制列表长度
        if (newUsers.length > limit) {
            newUsers = newUsers.slice(0, limit);
        }
        
        // 保存新增用户列表
        saveNewUsers(newUsers);
        
        // 更新收益明细
        const today = getCurrentDate();
        for (let i = 0; i < increaseAmount; i++) {
            updateIncomeList({
                type: '邀请奖励',
                date: today,
                amount: unitPrice.toFixed(2)
            }, true);
        }
        
        // 更新页面显示
        updateTotalInvitesDisplay();
        updateTodayInvitesDisplay();
        updateNewUsersList(true);
        
        // 显示增长提示
        showGrowthToast(increaseAmount);
    } else {
        // 即使没有增长，也更新页面显示
        updateTotalInvitesDisplay();
        updateTodayInvitesDisplay();
        updateNewUsersList(false);
        
        // 显示无增长提示
        showToast('暂无新增邀请', 2000, 'info');
    }
    
    // 返回增加的数量
    return increaseAmount;
}

/**
 * 显示增长提示
 */
function showGrowthToast(increaseAmount) {
    const message = `🎉 恭喜！\n新增${increaseAmount}位用户`;
    showToast(message, 3000, 'success');
}

/**
 * 显示提现弹窗
 */
function showWithdrawModal() {
    // 计算可提现金额（与updateBalanceDisplay函数保持一致）
    const todayInvites = parseInt(localStorage.getItem('todayInvites') || '0');
    const unitPrice = parseFloat(localStorage.getItem('unitPrice') || '0.00');
    const balance = (todayInvites * unitPrice).toFixed(2);
    
    showModal('提现', `
        <div class="p-4">
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">提现金额</label>
                <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <div class="bg-gray-100 px-3 py-2 text-gray-500 border-r border-gray-200">¥</div>
                    <input type="number" id="withdrawAmount" class="w-full px-3 py-2 outline-none" placeholder="请输入提现金额" min="1" max="${balance}" step="0.01">
                </div>
                <p class="text-xs text-gray-500 mt-1">可提现金额：¥${balance}</p>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">提现方式</label>
                <div class="grid grid-cols-3 gap-2 mb-2">
                    <label class="withdraw-method-label border border-gray-200 rounded-lg p-3 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all" data-method="alipay">
                        <input type="radio" name="withdraw_method" class="hidden" value="alipay" checked>
                        <div class="text-2xl mb-1">💙</div>
                        <span class="text-sm font-medium">支付宝</span>
                    </label>
                    <label class="withdraw-method-label border border-gray-200 rounded-lg p-3 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all" data-method="wechat">
                        <input type="radio" name="withdraw_method" class="hidden" value="wechat">
                        <div class="text-2xl mb-1">💚</div>
                        <span class="text-sm font-medium">微信</span>
                    </label>
                    <label class="withdraw-method-label border border-gray-200 rounded-lg p-3 text-center cursor-pointer hover:border-red-500 hover:bg-red-50 transition-all" data-method="bank">
                        <input type="radio" name="withdraw_method" class="hidden" value="bank">
                        <div class="text-2xl mb-1">💳</div>
                        <span class="text-sm font-medium">银行卡</span>
                    </label>
                </div>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">提现说明</label>
                <ul class="text-xs text-gray-500 space-y-1 list-disc pl-4">
                    <li>单笔提现金额最低1元</li>
                    <li>提现金额小于100元收取0.5%手续费</li>
                    <li>提现到账时间：支付宝（1小时内），微信（1小时内），银行卡（1-2个工作日）</li>
                </ul>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1" id="withdrawAccountLabel">支付宝账号</label>
                <input type="text" id="withdrawAccount" class="custom-input" placeholder="请输入支付宝账号">
                <p class="text-xs text-gray-500 mt-1" id="withdrawAccountTip">请确保支付宝账号信息正确，提现将在1小时内到账</p>
            </div>
            <button class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors" onclick="processWithdraw()">确认提现</button>
        </div>
    `);
    
    // 添加提现方式选择事件
    const methodLabels = document.querySelectorAll('.withdraw-method-label');
    const accountLabel = document.getElementById('withdrawAccountLabel');
    const accountInput = document.getElementById('withdrawAccount');
    const accountTip = document.getElementById('withdrawAccountTip');
    
    // 设置选中状态的样式
    const setSelectedMethod = (method) => {
        // 移除所有选中状态
        methodLabels.forEach(label => {
            label.classList.remove('border-blue-500', 'border-green-500', 'border-red-500', 'bg-blue-50', 'bg-green-50', 'bg-red-50');
            label.classList.add('border-gray-200');
        });
        
        // 根据选中的方式设置样式
        switch(method) {
            case 'alipay':
                document.querySelector('[data-method="alipay"]').classList.remove('border-gray-200');
                document.querySelector('[data-method="alipay"]').classList.add('border-blue-500', 'bg-blue-50');
                accountLabel.textContent = '支付宝账号';
                accountInput.placeholder = '请输入支付宝账号';
                accountTip.textContent = '请确保支付宝账号信息正确，提现将在1小时内到账';
                break;
            case 'wechat':
                document.querySelector('[data-method="wechat"]').classList.remove('border-gray-200');
                document.querySelector('[data-method="wechat"]').classList.add('border-green-500', 'bg-green-50');
                accountLabel.textContent = '微信账号';
                accountInput.placeholder = '请输入微信账号';
                accountTip.textContent = '请确保微信账号信息正确，提现将在1小时内到账';
                break;
            case 'bank':
                document.querySelector('[data-method="bank"]').classList.remove('border-gray-200');
                document.querySelector('[data-method="bank"]').classList.add('border-red-500', 'bg-red-50');
                accountLabel.textContent = '银行卡号';
                accountInput.placeholder = '请输入银行卡号';
                accountTip.textContent = '请确保银行卡号信息正确，提现将在1-2个工作日内到账';
                break;
        }
    };
    
    // 初始化选中状态
    setSelectedMethod('alipay');
    
    // 添加点击事件
    methodLabels.forEach(label => {
        label.addEventListener('click', function() {
            const method = this.getAttribute('data-method');
            const radioInput = this.querySelector('input[type="radio"]');
            radioInput.checked = true;
            setSelectedMethod(method);
        });
    });
    
    // 在控制台输出调试信息
    console.log('显示提现弹窗:', {
        todayInvites,
        unitPrice,
        balance
    });
}

/**
 * 更新收益明细列表
 * @param {Object} income - 收益信息对象，包含类型、日期和金额
 * @param {boolean} isNew - 是否为新增记录，新增记录会有动画和高亮效果
 */
function updateIncomeList(income, isNew = false) {
    const incomeList = document.querySelector('.income-list');
    if (!incomeList) return;
    
    // 创建新的收益项
    const incomeItem = document.createElement('li');
    incomeItem.className = 'py-3 border-b border-gray-100 last:border-0' + (isNew ? ' animate-new-item' : '');
    
    if (isNew) {
        incomeItem.style.backgroundColor = 'rgba(209, 250, 229, 0.6)'; // 加深绿色背景
        incomeItem.style.borderRadius = '0.375rem';
        incomeItem.style.padding = '0.5rem';
        incomeItem.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        incomeItem.style.marginBottom = '0.5rem';
        
        // 6秒后移除高亮效果
        setTimeout(() => {
            incomeItem.style.transition = 'background-color 2s ease';
            incomeItem.style.backgroundColor = 'transparent';
        }, 6000);
    }
    
    incomeItem.innerHTML = `
        <div class="flex justify-between items-center">
            <span class="font-medium${isNew ? ' text-green-600' : ''}">${income.type}</span>
            <span class="text-xs text-gray-500">${income.date}</span>
        </div>
        <div class="flex justify-between items-center mt-1">
            <span class="text-xs text-gray-500">收益金额</span>
            <span class="text-green-600 font-medium${isNew ? ' reward-highlight' : ''}">+¥${income.amount}</span>
        </div>
    `;
    
    // 添加到列表开头
    if (incomeList.firstChild) {
        incomeList.insertBefore(incomeItem, incomeList.firstChild);
    } else {
        incomeList.appendChild(incomeItem);
    }
    
    // 限制显示3条
    while (incomeList.children.length > 3) {
        incomeList.removeChild(incomeList.lastChild);
    }
}

/**
 * 更新提现记录列表
 * @param {Object} withdraw - 提现信息对象，包含方式、日期和金额
 * @param {boolean} isNew - 是否为新增记录，新增记录会有动画和高亮效果
 */
function updateWithdrawList(withdraw, isNew = false) {
    const withdrawList = document.querySelector('.withdraw-list');
    if (!withdrawList) return;
    
    // 创建新的提现项
    const withdrawItem = document.createElement('li');
    withdrawItem.className = 'py-3 border-b border-gray-100 last:border-0' + (isNew ? ' animate-new-item' : '');
    
    if (isNew) {
        withdrawItem.style.backgroundColor = 'rgba(254, 226, 226, 0.6)'; // 加深红色背景
        withdrawItem.style.borderRadius = '0.375rem';
        withdrawItem.style.padding = '0.5rem';
        withdrawItem.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        withdrawItem.style.marginBottom = '0.5rem';
        
        // 6秒后移除高亮效果
        setTimeout(() => {
            withdrawItem.style.transition = 'background-color 2s ease';
            withdrawItem.style.backgroundColor = 'transparent';
        }, 6000);
    }
    
    // 处理金额显示，确保正确显示负数
    const amountValue = parseFloat(withdraw.amount);
    const displayAmount = Math.abs(amountValue).toFixed(2);
    
    withdrawItem.innerHTML = `
        <div class="flex justify-between items-center">
            <span class="font-medium${isNew ? ' text-red-600' : ''}">提现到${withdraw.method || '银行卡'}</span>
            <span class="text-xs text-gray-500">${withdraw.date}</span>
        </div>
        <div class="flex justify-between items-center mt-1">
            <span class="text-xs text-gray-500">提现金额</span>
            <span class="text-red-600 font-medium${isNew ? ' reward-highlight' : ''}">-¥${displayAmount}</span>
        </div>
    `;
    
    // 添加到列表开头
    if (withdrawList.firstChild) {
        withdrawList.insertBefore(withdrawItem, withdrawList.firstChild);
    } else {
        withdrawList.appendChild(withdrawItem);
    }
    
    // 限制显示3条
    while (withdrawList.children.length > 3) {
        withdrawList.removeChild(withdrawList.lastChild);
    }
}

/**
 * 处理提现请求
 */
function processWithdraw() {
    // 获取提现金额输入框
    const withdrawInput = document.getElementById('withdrawAmount');
    if (!withdrawInput) return;
    
    // 获取提现金额
    const withdrawAmount = parseFloat(withdrawInput.value);
    
    // 计算可提现金额（与updateBalanceDisplay函数保持一致）
    const todayInvites = parseInt(localStorage.getItem('todayInvites') || '0');
    const unitPrice = parseFloat(localStorage.getItem('unitPrice') || '0.00');
    const balance = (todayInvites * unitPrice).toFixed(2);
    
    // 验证提现金额
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        showToast('请输入有效的提现金额', 2000, 'warning');
        return;
    }
    
    if (withdrawAmount < 1) {
        showToast('提现金额不能小于1元', 2000, 'warning');
        return;
    }
    
    if (withdrawAmount > parseFloat(balance)) {
        showToast('提现金额不能大于可提现金额', 2000, 'warning');
        return;
    }
    
    // 获取提现账号
    const withdrawAccount = document.getElementById('withdrawAccount');
    if (!withdrawAccount || !withdrawAccount.value.trim()) {
        showToast('请输入提现账号', 2000, 'warning');
        return;
    }
    
    // 获取提现方式
    const methodInputs = document.querySelectorAll('input[name="withdraw_method"]');
    let selectedMethod = '';
    let methodName = '';
    
    methodInputs.forEach((input) => {
        if (input.checked) {
            selectedMethod = input.value;
            methodName = input.closest('label').querySelector('span').textContent;
        }
    });
    
    // 根据提现方式验证账号格式
    const accountValue = withdrawAccount.value.trim();
    let isValid = true;
    let errorMsg = '';
    
    switch(selectedMethod) {
        case 'alipay':
            // 支付宝账号可以是手机号或邮箱
            if (!/^1[3-9]\d{9}$/.test(accountValue) && !/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(accountValue)) {
                isValid = false;
                errorMsg = '请输入有效的支付宝账号（手机号或邮箱）';
            }
            break;
        case 'wechat':
            // 微信账号通常是微信号或手机号
            if (accountValue.length < 6 || accountValue.length > 20) {
                isValid = false;
                errorMsg = '请输入有效的微信账号';
            }
            break;
        case 'bank':
            // 银行卡号通常是16-19位数字
            if (!/^\d{16,19}$/.test(accountValue)) {
                isValid = false;
                errorMsg = '请输入有效的银行卡号（16-19位数字）';
            }
            break;
    }
    
    if (!isValid) {
        showToast(errorMsg, 2000, 'warning');
        return;
    }
    
    // 创建提现记录
    const withdrawRecord = {
        method: methodName,
        date: getCurrentDate(),
        amount: -withdrawAmount.toFixed(2)
    };
    
    // 更新提现记录列表
    updateWithdrawList(withdrawRecord, true);
    
    // 更新余额（减去提现金额）
    localStorage.setItem('todayInvites', '0');
    
    // 更新余额显示
    updateBalanceDisplay();
    
    // 关闭模态框
    closeModal();
    
    // 显示提现成功提示
    showToast(`提现申请已提交，${withdrawAmount.toFixed(2)}元将转入您的${methodName}账户`, 3000, 'success');
}

/**
 * 退出登录确认
 */
function logoutConfirm() {
    showModal('退出登录', `
        <div class="p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 class="text-lg font-medium mb-2">确定要退出登录吗？</h3>
            <p class="text-sm text-gray-500 mb-4">退出后需要重新登录才能使用</p>
            <div class="flex space-x-3">
                <button class="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium" onclick="closeModal()">取消</button>
                <button class="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium" onclick="logout()">确定退出</button>
            </div>
        </div>
    `);
}

/**
 * 退出登录
 */
function logout() {
    // 这里可以添加实际的退出登录逻辑，如清除token等
    // 模拟退出登录
    showToast('退出登录成功');
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1500);
}

/**
 * 从首页跳转到"我的"页面并触发立即提现按钮
 */
function goToWithdraw() {
    // 将跳转意图存储在sessionStorage中
    sessionStorage.setItem('openWithdraw', 'true');
    // 跳转到"我的"页面
    window.location.href = 'pages/profile.html';
}

/**
 * 保存总邀请数
 */
function saveTotalInvites() {
    const totalInvitesInput = document.getElementById('totalInvites');
    if (!totalInvitesInput) return;

    const value = parseInt(totalInvitesInput.value);
    if (isNaN(value) || value < 0) {
        showToast('请输入有效的数字');
        return;
    }

    // 保存到 localStorage
    localStorage.setItem('totalInvites', value);
    showToast('保存成功');

    // 如果当前页面有显示总邀请数的元素，立即更新
    updateTotalInvitesDisplay();
}

/**
 * 更新页面上的总邀请数显示
 */
function updateTotalInvitesDisplay() {
    const totalInvites = localStorage.getItem('totalInvites') || '0';
    
    // 更新首页的总邀请数
    const homeInviteElements = document.querySelectorAll('.grid.grid-cols-3 .text-2xl.font-bold.text-blue-600');
    homeInviteElements.forEach(element => {
        if (element.closest('.container')) {
            element.textContent = totalInvites;
        }
    });

    // 更新我的页面的邀请人数
    const profileInviteElements = document.querySelectorAll('.text-2xl.font-bold, .text-lg.font-bold');
    profileInviteElements.forEach(element => {
        const parentText = element.parentElement?.textContent || '';
        if (parentText.includes('邀请') || parentText.includes('总邀请')) {
            element.textContent = totalInvites;
        }
    });

    // 更新邀请页面的总邀请人数
    const invitePageElements = document.querySelectorAll('.text-2xl.font-bold, .text-lg.font-bold');
    invitePageElements.forEach(element => {
        const parentText = element.parentElement?.textContent || '';
        if (parentText.includes('邀请人数') || parentText.includes('总邀请')) {
            element.textContent = totalInvites;
        }
    });
}

/**
 * 保存今日新增
 */
function saveTodayInvites() {
    const todayInvitesInput = document.getElementById('todayInvites');
    if (!todayInvitesInput) return;

    const value = parseInt(todayInvitesInput.value);
    if (isNaN(value) || value < 0) {
        showToast('请输入有效的数字');
        return;
    }

    // 保存到 localStorage
    localStorage.setItem('todayInvites', value.toString());
    showToast('保存成功');

    // 更新页面上的今日新增显示
    updateTodayInvitesDisplay();
    // 更新页面上的余额显示
    updateBalanceDisplay();
    
    // 添加调试信息
    console.log('今日新增已保存:', value);
}

/**
 * 更新页面上的今日新增显示
 */
function updateTodayInvitesDisplay() {
    const todayInvites = localStorage.getItem('todayInvites') || '0';
    
    // 更新首页的今日新增
    const homeTodayElements = document.querySelectorAll('.grid.grid-cols-3 .text-2xl.font-bold.text-purple-600');
    homeTodayElements.forEach(element => {
        if (element.closest('.container')) {
            element.textContent = todayInvites;
        }
    });

    // 更新邀请页面的今日新增
    const invitePageElements = document.querySelectorAll('.text-2xl.font-bold, .text-lg.font-bold');
    invitePageElements.forEach(element => {
        const parentText = element.parentElement?.textContent || '';
        if (parentText.includes('今日新增')) {
            element.textContent = todayInvites;
        }
    });
}

/**
 * 保存单价
 */
function saveUnitPrice() {
    const unitPriceInput = document.getElementById('unitPrice');
    if (!unitPriceInput) return;

    const value = parseFloat(unitPriceInput.value);
    if (isNaN(value) || value < 0) {
        showToast('请输入有效的数字');
        return;
    }

    // 格式化为两位小数
    const formattedValue = value.toFixed(2);
    
    // 保存到 localStorage
    localStorage.setItem('unitPrice', formattedValue);
    unitPriceInput.value = formattedValue; // 更新输入框显示为格式化后的值
    showToast('保存成功');

    // 更新页面上的收益显示
    updateEarningsDisplay();
    // 更新页面上的单价显示
    updateUnitPriceDisplay();
    // 更新页面上的余额显示
    updateBalanceDisplay();
    
    // 添加调试信息
    console.log('单价已保存:', formattedValue);
}

/**
 * 更新页面上的单价显示
 */
function updateUnitPriceDisplay() {
    const unitPrice = localStorage.getItem('unitPrice') || '0.00';
    
    // 更新所有显示单价的元素
    const unitPriceElements = document.querySelectorAll('.unit-price');
    unitPriceElements.forEach(element => {
        element.textContent = unitPrice;
    });
}

/**
 * 更新页面上的收益显示
 */
function updateEarningsDisplay() {
    const totalInvites = parseInt(localStorage.getItem('totalInvites') || '0');
    const unitPrice = parseFloat(localStorage.getItem('unitPrice') || '0.00');
    const totalEarnings = (totalInvites * unitPrice).toFixed(2);
    
    // 获取当前页面的路径
    const currentPath = window.location.pathname;
    
    // 首页 - 总收益
    if (currentPath.includes('index.html') || currentPath.endsWith('/')) {
        const homeEarningElement = document.querySelector('.grid.grid-cols-3 .p-2:nth-child(2) .text-2xl.font-bold.text-green-600');
        if (homeEarningElement) {
            homeEarningElement.textContent = `¥${totalEarnings}`;
        }
    }
    
    // 我的页面 - 累计收益
    if (currentPath.includes('profile.html')) {
        // 用户信息卡片中的累计收益
        const profileEarningElement = document.querySelector('.bg-gradient-to-r.from-blue-500.to-indigo-600 .grid.grid-cols-3 .p-2:nth-child(2) .text-2xl.font-bold');
        if (profileEarningElement) {
            profileEarningElement.textContent = `¥${totalEarnings}`;
        }
    }
    
    // 邀请页面 - 累计奖励
    if (currentPath.includes('invite.html')) {
        const inviteEarningElement = document.querySelector('.grid.grid-cols-3.gap-4.text-center.mb-4 .p-2:nth-child(2) .text-2xl.font-bold.text-green-600');
        if (inviteEarningElement) {
            inviteEarningElement.textContent = `¥${totalEarnings}`;
        }
    }
    
    // 更新收益明细中的金额
    const earningDetailElements = document.querySelectorAll('.text-green-600.font-medium');
    earningDetailElements.forEach(element => {
        const parentText = element.parentElement?.textContent || '';
        if (parentText.includes('邀请奖励')) {
            element.textContent = `+¥${unitPrice}`;
        }
    });
    
    // 在控制台输出调试信息
    console.log('更新收益显示:', {
        totalInvites,
        unitPrice,
        totalEarnings,
        currentPath
    });
}

/**
 * 保存邀请码
 */
function saveInviteCode() {
    const inviteCodeInput = document.getElementById('inviteCode');
    if (!inviteCodeInput) return;

    const value = inviteCodeInput.value.trim();
    if (!value) {
        showToast('请输入邀请码');
        return;
    }

    // 保存到 localStorage
    localStorage.setItem('inviteCode', value);
    showToast('保存成功');

    // 更新页面上的邀请码显示
    updateInviteCodeDisplay();
}

/**
 * 更新页面上的邀请码显示
 */
function updateInviteCodeDisplay() {
    const inviteCode = localStorage.getItem('inviteCode') || 'SHARE123';
    
    // 更新邀请页面的邀请码
    const inviteCodeElements = document.querySelectorAll('.text-xl.font-bold');
    inviteCodeElements.forEach(element => {
        const parentText = element.parentElement?.textContent || '';
        if (parentText.includes('邀请码')) {
            element.textContent = inviteCode;
        }
    });
}

/**
 * 更新页面上的余额显示（可提现金额和账户余额）
 */
function updateBalanceDisplay() {
    const todayInvites = parseInt(localStorage.getItem('todayInvites') || '0');
    const unitPrice = parseFloat(localStorage.getItem('unitPrice') || '0.00');
    const balance = (todayInvites * unitPrice).toFixed(2);
    
    // 获取当前页面的路径
    const currentPath = window.location.pathname;
    
    // 只在"我的"页面更新
    if (currentPath.includes('profile.html')) {
        // 更新用户信息卡片中的可提现金额
        const withdrawableElement = document.querySelector('.bg-gradient-to-r.from-blue-500.to-indigo-600 .grid.grid-cols-3 .p-2:nth-child(3) .text-2xl.font-bold');
        if (withdrawableElement) {
            withdrawableElement.textContent = `¥${balance}`;
        }
        
        // 更新钱包信息中的账户余额
        const balanceElement = document.querySelector('.bg-white .text-2xl.font-bold.text-blue-600');
        if (balanceElement) {
            balanceElement.textContent = `¥${balance}`;
        }
    }
    
    // 在控制台输出调试信息
    console.log('更新余额显示:', {
        todayInvites,
        unitPrice,
        balance,
        currentPath
    });
}

/**
 * 初始化下拉刷新功能
 */
function initPullToRefresh() {
    let startY = 0;
    let pullDistance = 0;
    const threshold = 80; // 触发刷新的阈值
    let isPulling = false;
    let isRefreshing = false;
    
    // 创建下拉刷新指示器
    const refreshIndicator = document.createElement('div');
    refreshIndicator.className = 'fixed top-0 left-0 right-0 flex items-center justify-center bg-blue-500 text-white py-2 transform -translate-y-full transition-transform duration-300 z-50';
    refreshIndicator.innerHTML = '<svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>正在刷新...';
    document.body.appendChild(refreshIndicator);
    
    // 触摸开始事件
    document.addEventListener('touchstart', function(e) {
        // 只有在页面顶部才能下拉刷新
        if (window.scrollY === 0) {
            startY = e.touches[0].clientY;
            isPulling = true;
        }
    }, { passive: true });
    
    // 触摸移动事件
    document.addEventListener('touchmove', function(e) {
        if (!isPulling || isRefreshing) return;
        
        pullDistance = e.touches[0].clientY - startY;
        
        // 只有下拉才触发刷新
        if (pullDistance > 0) {
            // 添加阻尼效果，使下拉越来越难
            const dampedDistance = Math.min(threshold * 1.5, pullDistance * 0.4);
            
            // 更新指示器位置
            refreshIndicator.style.transform = `translateY(${dampedDistance}px)`;
            
            // 防止页面滚动
            if (pullDistance > 10) {
                e.preventDefault();
            }
        }
    }, { passive: false });
    
    // 触摸结束事件
    document.addEventListener('touchend', function() {
        if (!isPulling || isRefreshing) return;
        
        isPulling = false;
        
        // 如果下拉距离超过阈值，触发刷新
        if (pullDistance > threshold) {
            performRefresh();
        } else {
            // 否则，恢复指示器位置
            refreshIndicator.style.transform = 'translateY(-100%)';
        }
        
        pullDistance = 0;
    }, { passive: true });
    
    // 执行刷新
    function performRefresh() {
        isRefreshing = true;
        
        // 显示刷新指示器
        refreshIndicator.style.transform = 'translateY(0)';
        
        // 模拟刷新过程
        setTimeout(function() {
            let increaseAmount = 0; // 在try块外部定义变量
            
            try {
                // 增加邀请人数
                increaseInviteCounts();
                
                // 获取增加的数量
                increaseAmount = parseInt(localStorage.getItem('lastIncreaseAmount') || '0');
                
                // 更新显示
                updateTotalInvitesDisplay();
                updateTodayInvitesDisplay();
                updateEarningsDisplay();
                updateBalanceDisplay();
                updateUnitPriceDisplay();
                
                // 更新新增用户列表，传递hasNewUsers参数
                updateNewUsersList(increaseAmount > 0);
            } catch (error) {
                console.error('刷新过程中发生错误:', error);
                showToast('刷新失败，请重试', 2000, 'error');
            }
            
            // 隐藏指示器
            refreshIndicator.style.transform = 'translateY(-100%)';
            
            // 显示刷新成功提示
            if (increaseAmount > 0) {
                showToast(`✨ 刷新成功 ✨\n新增${increaseAmount}位用户`, 3000, 'success');
            } else {
                showToast('✅ 刷新成功\n暂无新增用户', 3000, 'refresh');
            }
            
            // 延迟3秒后重置lastIncreaseAmount，与高亮效果消失时间一致
            setTimeout(() => {
                localStorage.setItem('lastIncreaseAmount', '0');
            }, 3000);
            
            isRefreshing = false;
        }, 1000);
    }
}

/**
 * 生成随机微信昵称
 * 包含各种类型：中文名、英文名、特殊符号、表情符号等
 */
function generateRandomNickname() {
    const nicknameTypes = [
        'chinese',      // 中文名
        'english',      // 英文名
        'mixed',        // 中英混合
        'special',      // 特殊符号
        'emoji',        // 表情符号
        'numbered'      // 带数字
    ];
    
    // 随机选择一种昵称类型
    const type = nicknameTypes[Math.floor(Math.random() * nicknameTypes.length)];
    
    // 中文常用姓氏
    const chineseSurnames = ['王', '李', '张', '刘', '陈', '杨', '黄', '赵', '吴', '周', '徐', '孙', '马', '朱', '胡', '林', '郭', '何', '高', '罗'];
    
    // 中文常用名字
    const chineseNames = ['小', '明', '华', '强', '伟', '芳', '娜', '秀英', '敏', '静', '丽', '涛', '超', '艳', '杰', '磊', '刚', '娟', '玲', '桂英', '建华', '文', '斌', '宇', '浩', '洋', '燕', '子'];
    
    // 英文常用名
    const englishNames = ['Alex', 'Bob', 'Cathy', 'David', 'Emma', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack', 'Kate', 'Leo', 'Mia', 'Nick', 'Olivia', 'Peter', 'Queen', 'Rose', 'Sam', 'Tom', 'Uma', 'Vicky', 'Will', 'Xander', 'Yolanda', 'Zack'];
    
    // 特殊符号
    const specialChars = ['♥', '★', '☆', '✿', '❀', '♪', '♫', '✨', '⭐', '🌟', '💫', '✡', '⚡', '☄', '✯'];
    
    // 表情符号
    const emojis = ['😊', '😂', '🥰', '😎', '🤔', '😇', '🙃', '🤩', '😋', '🤗', '👑', '🐱', '🐶', '🦊', '🐼', '🐯', '🦁', '🐻', '🐨', '🐮'];
    
    let nickname = '';
    
    switch (type) {
        case 'chinese':
            // 中文名：姓氏 + 名字
            nickname = chineseSurnames[Math.floor(Math.random() * chineseSurnames.length)] + 
                      chineseNames[Math.floor(Math.random() * chineseNames.length)];
            break;
            
        case 'english':
            // 英文名
            nickname = englishNames[Math.floor(Math.random() * englishNames.length)];
            // 50%概率加上姓氏首字母
            if (Math.random() > 0.5) {
                const initial = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                nickname = nickname + ' ' + initial + '.';
            }
            break;
            
        case 'mixed':
            // 中英混合
            if (Math.random() > 0.5) {
                // 英文名 + 中文姓
                nickname = englishNames[Math.floor(Math.random() * englishNames.length)] + 
                          chineseSurnames[Math.floor(Math.random() * chineseSurnames.length)];
            } else {
                // 中文名 + 英文
                nickname = chineseSurnames[Math.floor(Math.random() * chineseSurnames.length)] + 
                          chineseNames[Math.floor(Math.random() * chineseNames.length)] + 
                          englishNames[Math.floor(Math.random() * englishNames.length)];
            }
            break;
            
        case 'special':
            // 特殊符号 + 名字
            const specialChar = specialChars[Math.floor(Math.random() * specialChars.length)];
            if (Math.random() > 0.5) {
                nickname = specialChar + chineseSurnames[Math.floor(Math.random() * chineseSurnames.length)] + 
                          chineseNames[Math.floor(Math.random() * chineseNames.length)] + specialChar;
            } else {
                nickname = specialChar + englishNames[Math.floor(Math.random() * englishNames.length)] + specialChar;
            }
            break;
            
        case 'emoji':
            // 表情符号 + 名字
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];
            if (Math.random() > 0.5) {
                nickname = emoji + chineseSurnames[Math.floor(Math.random() * chineseSurnames.length)] + 
                          chineseNames[Math.floor(Math.random() * chineseNames.length)];
            } else {
                nickname = emoji + englishNames[Math.floor(Math.random() * englishNames.length)];
            }
            break;
            
        case 'numbered':
            // 带数字的昵称
            const number = Math.floor(Math.random() * 9999);
            if (Math.random() > 0.5) {
                nickname = chineseSurnames[Math.floor(Math.random() * chineseSurnames.length)] + 
                          chineseNames[Math.floor(Math.random() * chineseNames.length)] + number;
            } else {
                nickname = englishNames[Math.floor(Math.random() * englishNames.length)] + number;
            }
            break;
    }
    
    return nickname;
}

/**
 * 获取新增用户列表
 */
function getNewUsers() {
    try {
        const usersJson = localStorage.getItem('newUsers');
        console.log('读取新增用户数据:', usersJson);
        
        // 如果数据为空或无效，尝试从sessionStorage读取
        if (!usersJson) {
            const sessionUsersJson = sessionStorage.getItem('newUsers');
            console.log('从sessionStorage读取新增用户数据:', sessionUsersJson);
            return sessionUsersJson ? JSON.parse(sessionUsersJson) : [];
        }
        
        return JSON.parse(usersJson) || [];
    } catch (error) {
        console.error('解析新增用户列表失败:', error);
        
        // 尝试从sessionStorage读取
        try {
            const sessionUsersJson = sessionStorage.getItem('newUsers');
            return sessionUsersJson ? JSON.parse(sessionUsersJson) : [];
        } catch (e) {
            console.error('从sessionStorage解析新增用户列表也失败:', e);
            return [];
        }
    }
}

/**
 * 保存新增用户列表
 */
function saveNewUsers(users) {
    try {
        const usersJson = JSON.stringify(users);
        console.log('保存新增用户数据:', usersJson);
        
        // 同时保存到localStorage和sessionStorage
        localStorage.setItem('newUsers', usersJson);
        sessionStorage.setItem('newUsers', usersJson);
    } catch (error) {
        console.error('保存新增用户列表失败:', error);
        
        // 尝试只保存到sessionStorage
        try {
            sessionStorage.setItem('newUsers', JSON.stringify(users));
        } catch (e) {
            console.error('保存到sessionStorage也失败:', e);
        }
    }
}

/**
 * 获取当天日期
 */
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

/**
 * 生成新用户数据
 */
function generateNewUser(unitPrice) {
    return {
        nickname: generateRandomNickname(),
        date: getCurrentDate(),
        reward: parseFloat(unitPrice).toFixed(2)
    };
}

/**
 * 更新新增用户列表
 * @param {boolean} hasNewUsers - 是否有新增用户，用于决定是否添加高亮效果
 */
function updateNewUsersList(hasNewUsers = false) {
    // 获取新增用户列表容器
    const newUsersContainer = document.querySelector('.new-users-list');
    if (!newUsersContainer) return;
    
    // 获取新增用户列表
    const newUsers = getNewUsers();
    console.log('更新新增用户列表:', newUsers);
    
    // 获取新增用户显示数量限制
    const limit = getNewUsersLimit();
    
    // 清空容器
    newUsersContainer.innerHTML = '';
    
    // 如果没有新增用户，显示提示信息
    if (!newUsers || newUsers.length === 0) {
        newUsersContainer.innerHTML = '<div class="text-center py-4 text-gray-500">暂无新增用户</div>';
        return;
    }
    
    // 添加新增用户到列表（最多显示limit个）
    const displayUsers = newUsers.slice(0, limit);
    
    // 获取increaseInviteCounts函数中新增的用户数量
    const increaseAmount = parseInt(localStorage.getItem('lastIncreaseAmount') || '0');
    const lastUpdateTime = parseInt(localStorage.getItem('lastUpdateTime') || '0');
    
    // 检查是否是最近5分钟内更新的
    const isRecentUpdate = (Date.now() - lastUpdateTime) < 5 * 60 * 1000;
    
    // 如果是刚刚刷新页面，但有最近更新的数据，也显示高亮效果
    const shouldHighlight = hasNewUsers || (isRecentUpdate && increaseAmount > 0);
    
    displayUsers.forEach((user, index) => {
        const userElement = document.createElement('li');
        // 修改这里：根据shouldHighlight决定是否显示高亮效果
        const isNewUser = shouldHighlight && index < increaseAmount;
        
        userElement.className = 'py-3 border-b border-gray-100 last:border-0' + (isNewUser ? ' animate-new-item' : '');
        
        if (isNewUser) {
            userElement.style.backgroundColor = 'rgba(219, 234, 254, 0.6)'; // 加深蓝色背景
            userElement.style.borderRadius = '0.375rem';
            userElement.style.padding = '0.5rem';
            userElement.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            userElement.style.marginBottom = '0.5rem';
            
            // 6秒后移除高亮效果
            setTimeout(() => {
                userElement.style.transition = 'background-color 2s ease';
                userElement.style.backgroundColor = 'transparent';
            }, 6000);
        }
        
        userElement.innerHTML = `
            <div class="flex justify-between items-center">
                <span class="font-medium${isNewUser ? ' text-blue-600' : ''}">${user.nickname}</span>
                <span class="text-xs text-gray-500">${user.date}</span>
            </div>
            <div class="flex justify-between items-center mt-1">
                <span class="text-xs text-gray-500">邀请奖励</span>
                <span class="text-green-600 font-medium${isNewUser ? ' reward-highlight' : ''}">+¥${user.reward}</span>
            </div>
        `;
        
        newUsersContainer.appendChild(userElement);
    });
    
    // 如果显示的用户数量少于实际用户数量，显示提示信息
    if (newUsers.length > limit) {
        const moreElement = document.createElement('div');
        moreElement.className = 'text-center py-2 text-xs text-gray-500';
        moreElement.textContent = `仅显示最新${limit}条记录`;
        newUsersContainer.appendChild(moreElement);
    }
}

/**
 * 初始化个人页面的收益明细和提现记录
 */
function initProfileRecords() {
    // 获取单价
    const unitPrice = parseFloat(localStorage.getItem('unitPrice') || '0.9');
    
    // 初始化收益明细
    const incomeList = document.querySelector('.income-list');
    if (incomeList && incomeList.children.length === 0) {
        // 如果列表为空，添加示例数据
        const today = getCurrentDate();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const twoDaysAgoStr = `${twoDaysAgo.getFullYear()}-${String(twoDaysAgo.getMonth() + 1).padStart(2, '0')}-${String(twoDaysAgo.getDate()).padStart(2, '0')}`;
        
        // 先添加最早的记录（2天前），最后添加最近的记录（今天）
        updateIncomeList({
            type: '邀请奖励',
            date: twoDaysAgoStr,
            amount: unitPrice.toFixed(2)
        });
        
        updateIncomeList({
            type: '邀请奖励',
            date: yesterdayStr,
            amount: unitPrice.toFixed(2)
        });
        
        updateIncomeList({
            type: '邀请奖励',
            date: today,
            amount: unitPrice.toFixed(2)
        });
    }
    
    // 初始化提现记录
    const withdrawList = document.querySelector('.withdraw-list');
    if (withdrawList && withdrawList.children.length === 0) {
        // 如果列表为空，添加固定的提现记录
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        const oneDayAgoStr = `${oneDayAgo.getFullYear()}-${String(oneDayAgo.getMonth() + 1).padStart(2, '0')}-${String(oneDayAgo.getDate()).padStart(2, '0')}`;
        
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const twoDaysAgoStr = `${twoDaysAgo.getFullYear()}-${String(twoDaysAgo.getMonth() + 1).padStart(2, '0')}-${String(twoDaysAgo.getDate()).padStart(2, '0')}`;
        
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        const threeDaysAgoStr = `${threeDaysAgo.getFullYear()}-${String(threeDaysAgo.getMonth() + 1).padStart(2, '0')}-${String(threeDaysAgo.getDate()).padStart(2, '0')}`;
        
        // 先添加最早的记录（3天前），最后添加最近的记录（1天前）
        updateWithdrawList({
            method: '银行卡',
            date: threeDaysAgoStr,
            amount: '525.00'
        });
        
        updateWithdrawList({
            method: '支付宝',
            date: twoDaysAgoStr,
            amount: '425.00'
        });
        
        updateWithdrawList({
            method: '微信',
            date: oneDayAgoStr,
            amount: '366.00'
        });
    }
}

/**
 * 预览头像
 */
function previewAvatar() {
    const avatarUrl = document.getElementById('profileAvatarUrl').value.trim();
    if (!avatarUrl) {
        showToast('请输入有效的头像URL', 2000, 'warning');
        return;
    }
    
    const avatarPreview = document.getElementById('profileAvatarPreview');
    
    // 创建一个新的图片对象来测试URL是否有效
    const testImage = new Image();
    testImage.onload = function() {
        // 图片加载成功，更新预览
        avatarPreview.src = avatarUrl;
        showToast('头像预览成功', 2000, 'success');
    };
    testImage.onerror = function() {
        // 图片加载失败
        showToast('无效的图片URL，请检查后重试', 2000, 'error');
    };
    testImage.src = avatarUrl;
}

/**
 * 保存个人资料
 */
function saveProfile() {
    const avatarUrl = document.getElementById('profileAvatarUrl').value.trim();
    const nickname = document.getElementById('profileNickname').value.trim();
    const memberLevel = document.getElementById('profileMemberLevel').value.trim();
    const genderElements = document.getElementsByName('gender');
    let gender = '男';
    
    // 获取选中的性别
    for (let i = 0; i < genderElements.length; i++) {
        if (genderElements[i].checked) {
            gender = genderElements[i].nextElementSibling.textContent.trim();
            break;
        }
    }
    
    // 验证输入
    if (!nickname) {
        showToast('请输入昵称', 2000, 'warning');
        return;
    }
    
    if (!avatarUrl) {
        showToast('请输入头像URL', 2000, 'warning');
        return;
    }
    
    if (!memberLevel) {
        showToast('请输入会员等级', 2000, 'warning');
        return;
    }
    
    // 保存到localStorage
    localStorage.setItem('avatarUrl', avatarUrl);
    localStorage.setItem('nickname', nickname);
    localStorage.setItem('memberLevel', memberLevel);
    localStorage.setItem('gender', gender);
    
    // 更新页面上的显示
    updateProfileDisplay();
    
    // 关闭模态框
    closeModal();
    
    // 显示成功提示
    showToast('个人资料保存成功', 2000, 'success');
}

/**
 * 更新个人资料显示
 */
function updateProfileDisplay() {
    // 更新头像
    const avatarElements = document.querySelectorAll('.w-16.h-16.bg-white.rounded-full img');
    const avatarUrl = localStorage.getItem('avatarUrl') || 'https://dthezntil550i.cloudfront.net/p4/latest/p42102052243097410008650553/1280_960/12bc8bc0-2186-48fb-b432-6c011a559ec0.png';
    
    avatarElements.forEach(element => {
        element.src = avatarUrl;
    });
    
    // 更新昵称
    const nicknameElements = document.querySelectorAll('.text-xl.font-bold');
    const nickname = localStorage.getItem('nickname') || '张小明';
    
    nicknameElements.forEach(element => {
        element.textContent = nickname;
    });
    
    // 更新会员等级
    const memberLevelElements = document.querySelectorAll('.text-sm.opacity-90 > span:first-child');
    const memberLevel = localStorage.getItem('memberLevel') || '代理用户（有管道）';
    
    memberLevelElements.forEach(element => {
        element.textContent = memberLevel;
    });
    
    // 更新性别图标
    const genderElements = document.querySelectorAll('.gender-icon');
    const gender = localStorage.getItem('gender') || 'male';
    
    genderElements.forEach(element => {
        if (gender === 'male') {
            element.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" /></svg>';
        } else {
            element.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-pink-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" /></svg>';
        }
    });
}

/**
 * 保存首页活动图片设置
 */
function saveBannerImage() {
    const imageUrl = document.getElementById('bannerImage').value.trim();
    const linkUrl = document.getElementById('bannerLink').value.trim();
    
    // 验证图片URL
    if (!imageUrl) {
        showToast('请输入图片URL', 2000, 'warning');
        return;
    }
    
    // 保存到localStorage
    localStorage.setItem('bannerImage', imageUrl);
    localStorage.setItem('bannerLink', linkUrl);
    
    // 显示成功提示
    showToast('活动图片设置已保存', 2000, 'success');
}

/**
 * 初始化活动图片输入框
 */
function initBannerInput() {
    // 从localStorage获取图片设置
    const savedImageUrl = localStorage.getItem('bannerImage') || '';
    const savedLinkUrl = localStorage.getItem('bannerLink') || '';
    
    // 填充输入框
    const imageInput = document.getElementById('bannerImage');
    const linkInput = document.getElementById('bannerLink');
    
    if (imageInput) imageInput.value = savedImageUrl;
    if (linkInput) linkInput.value = savedLinkUrl;
}

/**
 * 初始化首页活动图片
 */
function initBanner() {
    // 获取banner容器
    const bannerContainer = document.getElementById('banner');
    if (!bannerContainer) return;
    
    // 从localStorage获取图片设置
    const imageUrl = localStorage.getItem('bannerImage');
    const linkUrl = localStorage.getItem('bannerLink');
    
    // 清空容器
    bannerContainer.innerHTML = '';
    
    // 如果没有设置图片，显示默认内容
    if (!imageUrl) {
        bannerContainer.innerHTML = `
            <div class="flex items-center justify-center h-40 bg-gray-100 rounded-lg">
                <p class="text-gray-500">暂无活动图片</p>
            </div>
        `;
        return;
    }
    
    // 创建图片元素
    const content = document.createElement('div');
    content.className = 'relative w-full';
    
    if (linkUrl) {
        // 如果有链接，创建一个链接包裹图片
        content.innerHTML = `
            <a href="${linkUrl}" class="block">
                <img src="${imageUrl}" alt="活动图片" class="w-full h-auto rounded-lg">
            </a>
        `;
    } else {
        // 如果没有链接，只显示图片
        content.innerHTML = `
            <img src="${imageUrl}" alt="活动图片" class="w-full h-auto rounded-lg">
        `;
    }
    
    // 添加到容器
    bannerContainer.appendChild(content);
    
    // 添加错误处理
    const img = content.querySelector('img');
    img.onerror = function() {
        this.onerror = null;
        bannerContainer.innerHTML = `
            <div class="flex items-center justify-center h-40 bg-gray-100 rounded-lg">
                <p class="text-gray-500">图片加载失败</p>
            </div>
        `;
    };
}