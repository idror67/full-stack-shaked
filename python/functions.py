
def arrCharLength(arr: list[str]):
    count = 0;
    for word in arr:
        count = count + len(word)


    return count


arr_of_words = ['a', 'bc', 'd'] # -> a= 1 , b=2, c=3, d=4

arr_char_len_of_arr = arrCharLength(arr_of_words)

print(arr_char_len_of_arr)