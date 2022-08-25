// eslint-disable-next-line no-new
const app = new Vue({
    el: "#app",
    data: {
        currentSetNumber: 0,
        checkedGroups: [],
        sets: sets,
        isGameStarted: false,
        isGameEnded: false,
        queue: [],
        errors: {},
        inputText: ""
    },
    computed: {
        currentSet() {
            return this.sets[this.currentSetNumber];
        },
        selectedAll() {
            return this.checkedGroups.length >= this.currentSet.groups.length;
        },
        nextItem() {
            if (this.queue.length < 1) {
                return null;
            }
            return this.queue[0];
        }
    },
    methods: {
        toggleSelectAll() {
            if (this.selectedAll) {
                this.checkedGroups = [];
            } else {
                this.checkedGroups = [];
                for (let i = 0; i < this.currentSet.groups.length; i++) {
                    this.checkedGroups.push(i);
                }
            }
        },
        menu() {
            this.isGameStarted = false;
            this.isGameEnded = false;
        },
        start() {
            if (this.checkedGroups.length < 1) {
                alert("Please select at least one group");
                return;
            }
            this.isGameEnded = false;
            this.isGameStarted = true;
            this.queue = [];
            this.errors = {};
            for (let groupNum of this.checkedGroups) {
                for (let item of this.currentSet.groups[groupNum].characters) {
                    console.log(item)
                    this.queue.push(item);
                    this.errors[item[0]] = 0;
                }
            }
            shuffle(this.queue);
        },
        showRed() {
            document.querySelector("#current-character").classList.add("incorrect");
            setTimeout(() => {
                document.querySelector("#current-character").classList.remove("incorrect");
            }, 200)
        },
        submit() {
            if (!this.isGameStarted) return
            const text = this.inputText.trim().toUpperCase();
            if (text === "") return;
            this.inputText = "";
            let correct = false;
            for (let ans of this.nextItem.slice(1)) {
                if (text === ans.trim().toUpperCase()) {
                    this.queue.splice(0, 1);
                    correct = true;
                    break;
                }
            }
            if (!correct) {
                this.showRed();
                this.errors[this.nextItem[0]]++;
            }
            if (this.nextItem === null) {
                this.isGameEnded = true;
            }
        },
        skip() {
            this.showRed();
            this.errors[this.nextItem[0]]++;
            const item = this.nextItem;
            this.queue.splice(0, 1);
            this.queue.push(item);
        },
        giveUp() {
            for (let item of this.queue) {
                this.errors[item[0]] = "N/A";
            }
            this.isGameEnded = true;
        }
    },
    mounted() {
        const submit = this.submit;
        document.querySelector('body').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                submit();
            }
        });
    },
    watch: {
    }
});
