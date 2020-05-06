(ns calva.js-utils
  (:require [cljs.reader]
            [cljs.test :refer [is]]))

(defn jsify
  "Converts clojure data to js data"
  {:test (fn []
           (is (= (pr-str (jsify {:foo [1 {:bar :baz}]}))
                  (pr-str #js {:foo #js [1 #js {:bar "baz"}]})))
           (is (= (pr-str (jsify {:foo/bar :foo/bar}))
                  (pr-str #js {"foo/bar" "foo/bar"}))))}
  [o]
  (clj->js o :keyword-fn (fn [kw] (str (symbol kw)))))

(defn cljify [o]
  (js->clj o :keywordize-keys true))

(defn clj-stringify [o]
  (-> o
      js->clj
      pr-str))
