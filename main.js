const input = document.getElementById("input");

const total_word_count = document.getElementById("twc");
const unique_word_count = document.getElementById("uwc");
const average_word_length = document.getElementById("awl");
const most_used_word = document.getElementById("muw");
const least_used_word = document.getElementById("luw");
const frequency_list = document.getElementById("freq_list");

const punc_checkbox = document.getElementById('punc_checkbox');
const capit_checkbox = document.getElementById('capit_checkbox');
let punctuation_ignored = false;
let capitlization_ignored = false;

let freq_list_raw = "";

function updateStats() {
    let text = input.value;
    let words = [];
    if (punctuation_ignored) {
        text = text.replace(/[^\w\s']/g, ' ');
    }
    words = text.split(/\s+/);
    total_word_count.innerText = words.length;
    if (words.length == 0) {
        unique_word_count.innerText = "0";
        average_word_length.innerText = "0";
        most_used_word.innerText = "";
        least_used_word.innerText = "";
        return;
    }
    let word_counts = {};
    let total_length = 0;
    for (let i = 1; i < words.length; i++) {
        let word = words[i]
        if (capitlization_ignored) {
            word = word.toLowerCase();
        }
        if (word.length == 0) {
            continue;
        }
        if (!word_counts[word]) {
            word_counts[word] = 0;
        }
        word_counts[word]++;
        total_length += word.length;
    }

    const word_count_pairs = Object.entries(word_counts);
    word_count_pairs.sort((a, b) => b[1] - a[1]);
    frequency_list.innerHTML = "";
    freq_list_raw = "";
    word_count_pairs.forEach(([word, count]) => {
        list_item = document.createElement('li');
        list_item.innerHTML = `${word} <span class="count">${count}</span>`;
        freq_list_raw += `${word}: ${count}\n`;
        frequency_list.appendChild(list_item);
    });

    unique_word_count.innerText = word_count_pairs.length;
    average_word_length.innerText = total_length / words.length;
    least_used_word.innerText = word_count_pairs[word_count_pairs.length-1][0];
    most_used_word.innerText = word_count_pairs[0][0];
}

input.addEventListener('input', updateStats);
punc_checkbox.addEventListener('input', () => {
    punctuation_ignored = punc_checkbox.checked;
    updateStats();
});
capit_checkbox.addEventListener('input', () => {
    capitlization_ignored = capit_checkbox.checked;
    updateStats();
});

copy_button.addEventListener('click', () => {
    navigator.clipboard.writeText(freq_list_raw)
        .catch(err => {
            console.error('Failed to copy frequency list: ', err);
        });
});