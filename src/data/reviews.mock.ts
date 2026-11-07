import type { Review } from "@/types";

/**
 * Hand-seeded reviews so counts, rating spread and dates are intentional.
 * Splendor has none (empty state); Catan and Wingspan have more than five
 * (Show more). Bodies are Vietnamese; UI copy stays English.
 */
export const reviews: Review[] = [
  // Catan — 6 reviews
  {
    id: "rev_catan_1",
    productId: "prd_catan",
    authorId: "acc_meeple_master",
    rating: 5,
    body: "Mua cho gia đình chơi cuối tuần, ai cũng mê. Luật dễ hiểu, tương tác cao.",
    createdAt: "2026-09-14T09:20:00.000Z",
  },
  {
    id: "rev_catan_2",
    productId: "prd_catan",
    authorId: "acc_hanoi_dice",
    rating: 4,
    body: "Bản in đẹp, giao hàng nhanh. Hơi phụ thuộc xúc xắc nhưng vẫn rất vui.",
    createdAt: "2026-08-02T14:05:00.000Z",
  },
  {
    id: "rev_catan_3",
    productId: "prd_catan",
    authorId: "acc_saigon_meeple",
    rating: 5,
    createdAt: "2026-06-21T11:40:00.000Z",
  },
  {
    id: "rev_catan_4",
    productId: "prd_catan",
    authorId: "acc_linh_rolls",
    rating: 3,
    body: "Chơi ổn nhưng mình thấy hơi lặp sau vài ván. Hợp người mới.",
    createdAt: "2026-04-11T08:15:00.000Z",
  },
  {
    id: "rev_catan_5",
    productId: "prd_catan",
    authorId: "acc_minh_meeple",
    rating: 2,
    body: "Box móp nhẹ khi nhận, nội dung game thì ổn. Trừ điểm phần đóng gói.",
    createdAt: "2026-02-08T16:30:00.000Z",
  },
  {
    id: "rev_catan_6",
    productId: "prd_catan",
    authorId: "acc_viet_meeple",
    rating: 5,
    createdAt: "2025-11-30T10:00:00.000Z",
  },

  // Wingspan — 6 reviews
  {
    id: "rev_wingspan_1",
    productId: "prd_wingspan",
    authorId: "acc_anny_board",
    rating: 5,
    body: "Artwork tuyệt đẹp, nhẹ nhàng và cuốn hút. Rất hợp chơi một mình.",
    createdAt: "2026-10-05T13:10:00.000Z",
  },
  {
    id: "rev_wingspan_2",
    productId: "prd_wingspan",
    authorId: "acc_chi_nguyen",
    rating: 5,
    body: "Cơ chế engine building mượt, cân bằng tốt. Đáng từng đồng.",
    createdAt: "2026-09-01T09:45:00.000Z",
  },
  {
    id: "rev_wingspan_3",
    productId: "prd_wingspan",
    authorId: "acc_tuong_gaming",
    rating: 4,
    body: "Thành phần đẹp, hộp hơi to. Chơi 4 người hơi lâu nhưng vẫn thích.",
    createdAt: "2026-07-19T18:25:00.000Z",
  },
  {
    id: "rev_wingspan_4",
    productId: "prd_wingspan",
    authorId: "acc_huy_tabletop",
    rating: 3,
    body: "Đẹp nhưng hơi ít tương tác giữa người chơi. Hợp nhóm thích chill.",
    createdAt: "2026-05-03T12:00:00.000Z",
  },
  {
    id: "rev_wingspan_5",
    productId: "prd_wingspan",
    authorId: "acc_meeple_master",
    rating: 2,
    body: "Mình không hợp theme chim. Luật nhiều chi tiết nhỏ.",
    createdAt: "2026-03-12T15:35:00.000Z",
  },
  {
    id: "rev_wingspan_6",
    productId: "prd_wingspan",
    authorId: "acc_hanoi_dice",
    rating: 4,
    createdAt: "2026-01-25T07:50:00.000Z",
  },

  // Ticket to Ride: Europe — 4 reviews
  {
    id: "rev_ttr_europe_1",
    productId: "prd_ticket-to-ride-europe",
    authorId: "acc_saigon_meeple",
    rating: 5,
    body: "Gateway hoàn hảo cho người mới. Cả nhà chơi liên tục.",
    createdAt: "2026-09-22T10:15:00.000Z",
  },
  {
    id: "rev_ttr_europe_2",
    productId: "prd_ticket-to-ride-europe",
    authorId: "acc_linh_rolls",
    rating: 4,
    body: "Luật đơn giản, ván nào cũng căng. Bản Europe có thêm tunnel khá thú vị.",
    createdAt: "2026-07-07T14:20:00.000Z",
  },
  {
    id: "rev_ttr_europe_3",
    productId: "prd_ticket-to-ride-europe",
    authorId: "acc_minh_meeple",
    rating: 3,
    body: "Chất lượng linh kiện ổn, tàu hơi nhỏ. Vẫn đáng chơi.",
    createdAt: "2026-05-16T09:05:00.000Z",
  },
  {
    id: "rev_ttr_europe_4",
    productId: "prd_ticket-to-ride-europe",
    authorId: "acc_viet_meeple",
    rating: 5,
    createdAt: "2026-02-14T19:40:00.000Z",
  },

  // Azul — 3 reviews
  {
    id: "rev_azul_1",
    productId: "prd_azul",
    authorId: "acc_anny_board",
    rating: 5,
    body: "Dễ học, đẹp mắt, chơi 2 người rất nhanh. Một trong những game mình thích nhất.",
    createdAt: "2026-08-28T11:30:00.000Z",
  },
  {
    id: "rev_azul_2",
    productId: "prd_azul",
    authorId: "acc_chi_nguyen",
    rating: 4,
    createdAt: "2026-06-09T16:10:00.000Z",
  },
  {
    id: "rev_azul_3",
    productId: "prd_azul",
    authorId: "acc_tuong_gaming",
    rating: 4,
    body: "Tiles cầm chắc tay, màu sắc nổi bật. Hơi khó với trẻ nhỏ.",
    createdAt: "2026-03-30T08:45:00.000Z",
  },

  // Pandemic — 2 reviews
  {
    id: "rev_pandemic_1",
    productId: "prd_pandemic",
    authorId: "acc_huy_tabletop",
    rating: 4,
    body: "Co-op căng thẳng, cả nhóm phải bàn bạc liên tục. Rất đáng thử.",
    createdAt: "2026-04-20T13:55:00.000Z",
  },
  {
    id: "rev_pandemic_2",
    productId: "prd_pandemic",
    authorId: "acc_meeple_master",
    rating: 2,
    body: "Hơi khó thắng với người mới, dễ gây nản. Chất lượng thành phần tốt.",
    createdAt: "2025-12-11T17:25:00.000Z",
  },

  // Carcassonne — 3 reviews
  {
    id: "rev_carcassonne_1",
    productId: "prd_carcassonne",
    authorId: "acc_hanoi_dice",
    rating: 4,
    body: "Đơn giản mà sâu, mở rộng dễ. Gia đình mình chơi suốt.",
    createdAt: "2026-09-09T10:50:00.000Z",
  },
  {
    id: "rev_carcassonne_2",
    productId: "prd_carcassonne",
    authorId: "acc_saigon_meeple",
    rating: 5,
    createdAt: "2026-06-27T12:35:00.000Z",
  },
  {
    id: "rev_carcassonne_3",
    productId: "prd_carcassonne",
    authorId: "acc_linh_rolls",
    rating: 3,
    body: "Chơi ổn nhưng hơi phụ thuộc may mắn khi rút tile.",
    createdAt: "2026-01-18T09:15:00.000Z",
  },

  // 7 Wonders — 3 reviews
  {
    id: "rev_7_wonders_1",
    productId: "prd_7-wonders",
    authorId: "acc_minh_meeple",
    rating: 5,
    body: "Draft bài cực vui, chơi 7 người vẫn gọn. Rất đáng tiền.",
    createdAt: "2026-08-15T15:45:00.000Z",
  },
  {
    id: "rev_7_wonders_2",
    productId: "prd_7-wonders",
    authorId: "acc_viet_meeple",
    rating: 4,
    createdAt: "2026-05-25T11:05:00.000Z",
  },
  {
    id: "rev_7_wonders_3",
    productId: "prd_7-wonders",
    authorId: "acc_anny_board",
    rating: 4,
    body: "Nhiều biểu tượng cần làm quen, nhưng sau ván đầu là mượt.",
    createdAt: "2026-02-19T14:30:00.000Z",
  },

  // Dixit — 2 reviews
  {
    id: "rev_dixit_1",
    productId: "prd_dixit",
    authorId: "acc_chi_nguyen",
    rating: 5,
    body: "Tranh vẽ đẹp mê, chơi với trẻ rất vui. Sáng tạo không giới hạn.",
    createdAt: "2026-07-12T17:00:00.000Z",
  },
  {
    id: "rev_dixit_2",
    productId: "prd_dixit",
    authorId: "acc_tuong_gaming",
    rating: 3,
    createdAt: "2025-10-08T10:25:00.000Z",
  },

  // Codenames — 3 reviews
  {
    id: "rev_codenames_1",
    productId: "prd_codenames",
    authorId: "acc_huy_tabletop",
    rating: 5,
    body: "Party game xuất sắc, nhóm đông càng vui. Dễ dạy người mới.",
    createdAt: "2026-10-01T19:15:00.000Z",
  },
  {
    id: "rev_codenames_2",
    productId: "prd_codenames",
    authorId: "acc_meeple_master",
    rating: 4,
    body: "Từ khóa tiếng Việt hơi khó với người chưa quen. Vẫn rất vui.",
    createdAt: "2026-06-14T13:40:00.000Z",
  },
  {
    id: "rev_codenames_3",
    productId: "prd_codenames",
    authorId: "acc_hanoi_dice",
    rating: 4,
    createdAt: "2026-03-05T08:20:00.000Z",
  },

  // Ultimate Werewolf — 2 reviews
  {
    id: "rev_werewolf_1",
    productId: "prd_ultimate-werewolf",
    authorId: "acc_saigon_meeple",
    rating: 4,
    body: "Đông người cực vui, cần người dẫn trò khéo. Box đầy đủ.",
    createdAt: "2026-09-18T16:50:00.000Z",
  },
  {
    id: "rev_werewolf_2",
    productId: "prd_ultimate-werewolf",
    authorId: "acc_linh_rolls",
    rating: 2,
    body: "Khó tụ tập đủ người để chơi. Chất lượng thẻ ổn.",
    createdAt: "2026-04-01T12:10:00.000Z",
  },

  // Exploding Kittens — 2 reviews
  {
    id: "rev_kittens_1",
    productId: "prd_exploding-kittens",
    authorId: "acc_minh_meeple",
    rating: 4,
    body: "Vui nhanh, dễ mang đi. Hơi lặp nếu chơi nhiều.",
    createdAt: "2026-08-06T09:35:00.000Z",
  },
  {
    id: "rev_kittens_2",
    productId: "prd_exploding-kittens",
    authorId: "acc_viet_meeple",
    rating: 3,
    createdAt: "2026-01-09T15:00:00.000Z",
  },

  // Everdell — 3 reviews
  {
    id: "rev_everdell_1",
    productId: "prd_everdell",
    authorId: "acc_anny_board",
    rating: 5,
    body: "Thành phần đẹp nhất mình từng mở hộp. Gameplay sâu, cân bằng.",
    createdAt: "2026-10-11T11:45:00.000Z",
  },
  {
    id: "rev_everdell_2",
    productId: "prd_everdell",
    authorId: "acc_chi_nguyen",
    rating: 5,
    body: "Rất đáng chơi, cây Everdell quá đẹp. Hơi chiếm chỗ.",
    createdAt: "2026-07-28T14:55:00.000Z",
  },
  {
    id: "rev_everdell_3",
    productId: "prd_everdell",
    authorId: "acc_tuong_gaming",
    rating: 4,
    createdAt: "2026-05-07T18:05:00.000Z",
  },

  // Brass: Birmingham — 2 reviews
  {
    id: "rev_brass_1",
    productId: "prd_brass-birmingham",
    authorId: "acc_huy_tabletop",
    rating: 5,
    body: "Nặng nhưng cực kỳ thỏa mãn. Bản tái bản đẹp, luật chặt chẽ.",
    createdAt: "2026-09-30T10:30:00.000Z",
  },
  {
    id: "rev_brass_2",
    productId: "prd_brass-birmingham",
    authorId: "acc_meeple_master",
    rating: 4,
    createdAt: "2026-04-24T13:15:00.000Z",
  },

  // Gloomhaven: Jaws of the Lion — 2 reviews
  {
    id: "rev_gloomhaven_1",
    productId: "prd_gloomhaven-jaws-of-the-lion",
    authorId: "acc_hanoi_dice",
    rating: 5,
    body: "Campaign hay, hướng dẫn người mới tốt. Chơi solo rất ổn.",
    createdAt: "2026-08-19T16:25:00.000Z",
  },
  {
    id: "rev_gloomhaven_2",
    productId: "prd_gloomhaven-jaws-of-the-lion",
    authorId: "acc_saigon_meeple",
    rating: 4,
    body: "Hơi dài nếu chơi 4 người. Nội dung phong phú, đáng thử.",
    createdAt: "2026-03-21T09:50:00.000Z",
  },

  // Splendor — intentionally no reviews (empty state)
];
