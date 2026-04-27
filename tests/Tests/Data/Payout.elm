module Tests.Data.Payout exposing (..)

import Data.Payout exposing (payoutEstimates)
import Dict
import Expect
import Test exposing (Test, describe, test)


suite : Test
suite =
    describe "Data Payout"
        [ test "returns empty payouts for zero pot" <|
            \_ ->
                Expect.equal Dict.empty <|
                    payoutEstimates 0 10
                        [ { riderId = "a", points = 20 }
                        , { riderId = "b", points = 10 }
                        ]
        , test "applies the minimum points threshold" <|
            \_ ->
                Expect.equal (Dict.fromList [ ( "b", 1000 ) ]) <|
                    payoutEstimates 1000 10
                        [ { riderId = "a", points = 9 }
                        , { riderId = "b", points = 10 }
                        ]
        , test "splits proportionally when nobody hits the cap" <|
            \_ ->
                Expect.equal
                    (Dict.fromList [ ( "a", 600 ), ( "b", 400 ) ])
                <|
                    payoutEstimates 1000 0
                        [ { riderId = "a", points = 6 }
                        , { riderId = "b", points = 4 }
                        ]
        , test "caps riders at 20 percent and redistributes the remainder" <|
            \_ ->
                Expect.equal
                    (Dict.fromList [ ( "a", 200 ), ( "b", 200 ), ( "c", 200 ), ( "d", 200 ), ( "e", 200 ) ])
                <|
                    payoutEstimates 1000 0
                        [ { riderId = "a", points = 100 }
                        , { riderId = "b", points = 1 }
                        , { riderId = "c", points = 1 }
                        , { riderId = "d", points = 1 }
                        , { riderId = "e", points = 1 }
                        ]
        , test "keeps riders below threshold out of redistribution" <|
            \_ ->
                Expect.equal
                    (Dict.fromList [ ( "a", 200 ), ( "b", 200 ), ( "c", 200 ), ( "d", 200 ), ( "e", 200 ) ])
                <|
                    payoutEstimates 1000 1
                        [ { riderId = "a", points = 100 }
                        , { riderId = "b", points = 1 }
                        , { riderId = "c", points = 1 }
                        , { riderId = "d", points = 1 }
                        , { riderId = "e", points = 1 }
                        , { riderId = "f", points = 0 }
                        ]
        ]
