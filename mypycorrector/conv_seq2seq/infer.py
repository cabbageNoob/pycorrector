# -*- coding: utf-8 -*-
'''
@Descripttion: 
@version: 
@Author: cjh <492795090@qq.com>
@Date: 2019-12-13 14:54:36
@LastEditors: cjh <492795090@qq.com>
@LastEditTime: 2020-02-24 10:35:40
'''

import sys
import os
from fairseq import options
sys.path.append('../..')
sys.path.insert(0,os.getcwd())

from mypycorrector.conv_seq2seq import config
from mypycorrector.conv_seq2seq import interactive


def infer(model_path, vocab_dir, arch, test_data, max_len, temperature):
    parser = options.get_generation_parser(interactive=True)
    parser.set_defaults(arch=arch,
                        input=test_data,
                        max_tokens=max_len,
                        temperature=temperature,
                        path=model_path)
    args = options.parse_args_and_arch(parser, input_args=[vocab_dir])
    return interactive.main(args)


def infer_interactive(model_path, vocab_dir, arch, max_len, temperature=1.0):
    return infer(model_path, vocab_dir, arch, '-', max_len, temperature)


if __name__ == '__main__':
    # 通过文本预测
    inputs = [
        '由我起开始做。',
        '没有解决这个问题，',
        '由我起开始做。',
        '由我起开始做',
        '不能人类实现更美好的将来。',
        '这几年前时间，',
        '歌曲使人的感到快乐，',
        '少先队员因该为老人让坐，',
        '会能够大幅减少互相抱怨的情况。'
    ]
    outputs = infer(model_path=config.best_model_path,
                    vocab_dir=config.data_bin_dir,
                    arch=config.arch,
                    test_data=[' '.join(list(i)) for i in inputs],
                    max_len=config.max_len,
                    temperature=config.temperature)
    print("output:", outputs)

    # 通过文件预测
    outputs = infer(model_path=config.best_model_path,
                    vocab_dir=config.data_bin_dir,
                    arch=config.arch,
                    test_data=config.val_src_path,
                    max_len=config.max_len,
                    temperature=config.temperature)
    print("output:", outputs)
