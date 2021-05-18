let union = (setA, setB) => {
    let _union = new Set(setA)
    setB.forEach(item => _union.add(item))
    return _union
}

let _is_whitespace = char => {
    const whiteSpaceChars = [' ', '\t', '\n', '\r']
    if (whiteSpaceChars.includes(char) || char.match(/\p{General_Category=Zs}/gu)) return true
    return false
}

let _is_control = char => {
    const nonControlChars = ['\t', '\n', '\r']
    if (nonControlChars.includes(char)) return false
    if (char.match(/\p{General_Category=C}/gu)) return true
    return false
}

let _is_punctuation = char => {
    const codePoint = char.codePointAt(0)
    if ((codePoint >= 33 && codePoint <= 47) || (codePoint >= 58 && codePoint <= 64) || (codePoint >= 91 && codePoint <= 96) || (codePoint >= 123 && codePoint <= 126)) return true
    if (char.match(/\p{General_Category=P}/gu)) return true
    return false
}

let _is_end_of_word = text => {
    lastChar = text.charAt(text.length - 1)
    return _is_control(lastChar) || _is_punctuation(lastChar) || _is_whitespace(lastChar)
}

let _is_start_of_word = text => {
    firstChar = text.charAt(0)
    return _is_control(firstChar) || _is_punctuation(firstChar) || _is_whitespace(firstChar)
}

let whitespace_tokenize = text => {
    text = text.trim().replace(/\s+/g, ' ')
    if (!text) return []
    return text.split(' ')
}

class BasicTokenizer {

    constructor(do_lower_case=true, never_split=null, tokenize_chinese_chars=true, strip_accents=true) {
        this.do_lower_case = do_lower_case
        this.never_split = new Set(never_split || [])
        this.tokenize_chinese_chars = tokenize_chinese_chars
        this.strip_accents = strip_accents
    }

    tokenize(text, never_split=null) {
        never_split = never_split === null ? this.never_split : union(this.never_split, new Set(never_split))
        text = this._clean_text(text)

        if (this.tokenize_chinese_chars) text = this._tokenize_chinese_chars(text)
        const orig_tokens = whitespace_tokenize(text)
        let split_tokens = []

        orig_tokens.forEach(token => {
            if (!never_split.has(token)) {
                if (this.do_lower_case) token = token.toLowerCase()
                if (this.strip_accents) token = this._run_strip_accents(token)
            }
            split_tokens.push(...this._run_split_on_punc(token, never_split))
        })

        const output_tokens = whitespace_tokenize(split_tokens.join(' '))
        return output_tokens
    }

    _run_strip_accents(text) {
        text = text.normalize('NFD')
        let output = []
        for (const char of text) {
            let isNonSpaceMark = char.match(/\p{General_Category=Mn}/gu)
            if (isNonSpaceMark) continue
            output.push(char)
        }
        return output.join('')
    }

    _run_split_on_punc(text, never_split=null) {
        if (never_split && never_split.has(text)) return [text]
        const chars = [...text]
        let start_new_word = true
        let output = []

        chars.forEach(char => {
            if (_is_punctuation(char)) {
                output.push([char])
                start_new_word = true
            }
            else {
                if (start_new_word) output.push([])
                start_new_word = false
                output[output.length - 1].push(char)
            }
        })
        return output.map(array => array.join(''))
    }

    _tokenize_chinese_chars(text) {
        let output = []
        for (const char of text) {
            let codePoint = char.codePointAt(0)
            if (this._is_chinese_char(codePoint)) output.push(...[' ', char, ' '])
            else output.push(char)
        }
        return output.join('')
    }

    _is_chinese_char(codePoint) {
        if (
            codePoint >= 0x4E00 && codePoint <= 0x9FFF ||
            codePoint >= 0x3400 && codePoint <= 0x4DBF ||
            codePoint >= 0x20000 && codePoint <= 0x2A6DF ||
            codePoint >= 0x2A700 && codePoint <= 0x2B73F ||
            codePoint >= 0x2B740 && codePoint <= 0x2B81F ||
            codePoint >= 0x2B820 && codePoint <= 0x2CEAF ||
            codePoint >= 0xF900 && codePoint <= 0xFAFF ||
            codePoint >= 0x2F800 && codePoint <= 0x2FA1F
            ) return true
        return false
    }

    _clean_text(text) {
        let output = []
        for (const char of text) {
            let codePoint = char.codePointAt(0)
            if (codePoint === 0 || codePoint === 0xFFFD || _is_control(char)) continue
            if (_is_whitespace(char)) output.push(' ')
            else output.push(char)
        }
        return output.join('')
    }
}

class WordpieceTokenizer {

    constructor(vocab, unk_token, max_input_chars_per_word=100) {
        this.vocab = vocab
        this.unk_token = unk_token
        this.max_input_chars_per_word = max_input_chars_per_word
    }

    tokenize(text) {
        let output_tokens = []
        whitespace_tokenize(text).forEach(token => {
            const chars = [...token]
            if (chars.length > this.max_input_chars_per_word) {
                output_tokens.push(this.unk_token)
                return
            }
            let is_bad = false
            let start = 0
            let sub_tokens = []
            while (start < chars.length) {
                let end = chars.length
                let cur_substr = null
                while (start < end) {
                    let substr = chars.slice(start, end).join('')
                    if (start > 0) substr = `##${substr}`
                    if (this.vocab.hasOwnProperty(substr)) {
                        cur_substr = substr
                        break
                    }
                    end -= 1
                }
                if (!cur_substr) {
                    is_bad = true
                    break
                }
                sub_tokens.push(cur_substr)
                start = end
            }
            if (is_bad) output_tokens.push(this.unk_token)
            else output_tokens.push(...sub_tokens)
        })
        return output_tokens
    }
}

class BertTokenizer {

    constructor(vocab, max_length=64, do_lower_case=true, never_split=null, unk_token='[UNK]', sep_token='[SEP]', pad_token='[PAD]', cls_token='[CLS]', mask_token='[MASK]', tokenize_chinese_chars=true, strip_accents=true) {
        this.vocab = vocab
        this.max_length = max_length - 2
        this.unk_token = unk_token
        this.sep_token = sep_token
        this.cls_token = cls_token
        this.basic_tokenizer = new BasicTokenizer(
            do_lower_case=do_lower_case,
            never_split=never_split,
            tokenize_chinese_chars=tokenize_chinese_chars,
            strip_accents=strip_accents
        )
        this.wordpiece_tokenizer = new WordpieceTokenizer(
            vocab=this.vocab,
            unk_token=this.unk_token
        )
    }

    batchEncode(batchText) {
        if (typeof batchText === 'string') batchText = [batchText]
        if (Array.isArray(batchText)) {
            let batch_input_ids = []
            let batch_attention_mask = []
            batchText.forEach(text => {
                const input_ids = this._get_input_ids(text)
                const attention_mask = this._get_attention_mask(input_ids)
                batch_input_ids.push(input_ids)
                batch_attention_mask.push(attention_mask)
            })
            const batch_input_ids_tensor = this._convert_to_tensor2d(batch_input_ids)
            const batch_attention_mask_tensor = this._convert_to_tensor2d(batch_attention_mask)
            const batch_token_type_ids_tensor = tf.zerosLike(batch_input_ids_tensor)
            return {
                attention_mask: batch_attention_mask_tensor,
                input_ids: batch_input_ids_tensor,
                token_type_ids: batch_token_type_ids_tensor
            }
        }
    }

    _get_input_ids(text) {
        const tokens = this._tokenize(text)
        const token_ids = this._convert_tokens_to_ids(tokens)
        return this._add_padding(token_ids)
    }

    _get_attention_mask(input_ids) {
        return input_ids.map(input_id => input_id === 0 ? 0 : 1)
    }

    _convert_to_tensor2d(array, dtype='int32') {
        return tf.tensor2d(array, null, dtype)
    }

    _tokenize(text, never_split=null) {
        let split_tokens = []
        for (const token of this.basic_tokenizer.tokenize(text, never_split=never_split)) {
            if (this.basic_tokenizer.never_split.has(token)) split_tokens.push(token)
            else split_tokens.push(...this.wordpiece_tokenizer.tokenize(token))
            if (split_tokens.length >= this.max_length) break
        }
        return split_tokens
    }

    _convert_tokens_to_ids(tokens) {
        if (typeof tokens === 'string') return this._convert_token_to_id(tokens)
        return tokens.map(token => this._convert_token_to_id(token))
    }

    _convert_token_to_id(token) {
        return this.vocab.hasOwnProperty(token) ? this.vocab[token] : this.vocab[this.unk_token]
    }

    _build_inputs_with_special_tokens(token_ids) {
        return [this.vocab[this.cls_token], ...token_ids, this.vocab[this.sep_token]]
    }

    _add_padding(token_ids) {
        if (token_ids.length >= this.max_length) return this._build_inputs_with_special_tokens(token_ids.slice(0, this.max_length))
        const length_diff = this.max_length - token_ids.length
        const padding = new Array(length_diff).fill(0)
        return [...this._build_inputs_with_special_tokens(token_ids), ...padding]
    }
}